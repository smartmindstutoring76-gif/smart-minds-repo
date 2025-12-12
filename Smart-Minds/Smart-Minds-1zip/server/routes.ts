import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import Stripe from "stripe";
import session from "express-session";
import { registerSchema, loginSchema } from "@shared/schema";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: string;
    userRole: string;
    isPaid: boolean;
  }
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-04-30.basil" })
  : null;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "smart-minds-session-secret-key-2025",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input", errors: parsed.error.errors });
      }

      const { email, password, name, phone } = parsed.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        phone: phone || null,
        role: "student",
      });

      res.json({
        message: "Registration successful. Please complete payment to access your account.",
        userId: user.id,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
      }

      const { email, password } = parsed.data;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isPaid && user.role !== "teacher") {
        return res.status(403).json({
          message: "Your subscription is not active. Please complete payment to access your account.",
          requiresPayment: true,
          userId: user.id,
        });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      req.session.isPaid = user.isPaid;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isPaid: user.isPaid,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPaid: user.isPaid,
      },
    });
  });

  app.post("/api/create-checkout-session", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment system is being configured. Please contact support at tsmartminds@gmail.com",
        error: "STRIPE_NOT_CONFIGURED"
      });
    }

    try {
      const { userId, subjects } = req.body;

      if (!userId || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await storage.updateUserStripeCustomerId(user.id, customerId);
      }

      const pricePerSubject = 25000;
      const totalAmount = subjects.length * pricePerSubject;

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "zar",
              product_data: {
                name: `Smart Minds Subscription - ${subjects.length} Subject(s)`,
                description: subjects.join(", "),
              },
              unit_amount: totalAmount,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: user.id,
          subjects: JSON.stringify(subjects),
        },
      });

      res.json({ url: checkoutSession.url });
    } catch (error) {
      console.error("Checkout session error:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post("/api/webhooks/stripe", async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(500).json({ message: "Payment system not configured" });
    }

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret) {
      return res.status(400).json({ message: "Missing signature or secret" });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody as Buffer,
        sig,
        endpointSecret
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).json({ message: "Invalid signature" });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        const userId = checkoutSession.metadata?.userId;
        const subjects = JSON.parse(checkoutSession.metadata?.subjects || "[]");

        if (userId) {
          await storage.updateUserPaidStatus(userId, true);
          await storage.createSubscription(
            userId,
            checkoutSession.subscription as string,
            subjects
          );
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
          const userId = (customer as Stripe.Customer).metadata?.userId;
          if (userId) {
            await storage.updateUserPaidStatus(userId, false);
          }
        }
        break;
      }
    }

    res.json({ received: true });
  });

  app.get("/api/quizzes/:subjectId", async (req: Request, res: Response) => {
    try {
      const quizzes = await storage.getQuizzesBySubject(req.params.subjectId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  app.get("/api/quiz/:quizId", async (req: Request, res: Response) => {
    try {
      const quiz = await storage.getQuizById(req.params.quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const questions = await storage.getQuestionsByQuizId(req.params.quizId);
      res.json({ quiz, questions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  app.post("/api/quiz/:quizId/submit", async (req: Request, res: Response) => {
    try {
      const { answers } = req.body;
      const questions = await storage.getQuestionsByQuizId(req.params.quizId);

      if (!questions || questions.length === 0) {
        return res.status(404).json({ message: "Quiz not found or has no questions" });
      }

      let score = 0;
      const results = questions.map((q) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correctAnswer;
        if (isCorrect) score++;
        return {
          questionId: q.id,
          userAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation || "No explanation available.",
        };
      });

      if (req.session.userId) {
        await storage.createQuizAttempt(
          req.session.userId,
          req.params.quizId,
          score,
          questions.length
        );
      }

      res.json({
        score,
        totalQuestions: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        results,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  app.post("/api/admin/seed-quizzes", async (req: Request, res: Response) => {
    try {
      const theorySubjects = [
        {
          id: "life-sciences",
          quizzes: [
            {
              title: "DNA: Code of Life",
              topic: "Genetics",
              questions: [
                {
                  question: "What is the shape of the DNA molecule?",
                  optionA: "Single helix",
                  optionB: "Double helix",
                  optionC: "Triple helix",
                  optionD: "Linear chain",
                  correctAnswer: "B",
                  explanation: "DNA has a double helix structure, discovered by Watson and Crick."
                },
                {
                  question: "Which base pairs with Adenine in DNA?",
                  optionA: "Guanine",
                  optionB: "Cytosine",
                  optionC: "Thymine",
                  optionD: "Uracil",
                  correctAnswer: "C",
                  explanation: "Adenine always pairs with Thymine (A-T) in DNA through 2 hydrogen bonds."
                },
                {
                  question: "What type of bond holds the two strands of DNA together?",
                  optionA: "Covalent bonds",
                  optionB: "Ionic bonds",
                  optionC: "Hydrogen bonds",
                  optionD: "Peptide bonds",
                  correctAnswer: "C",
                  explanation: "Hydrogen bonds between complementary base pairs hold the two DNA strands together."
                },
                {
                  question: "Which sugar is found in DNA?",
                  optionA: "Ribose",
                  optionB: "Deoxyribose",
                  optionC: "Glucose",
                  optionD: "Fructose",
                  correctAnswer: "B",
                  explanation: "DNA contains deoxyribose sugar, which lacks an oxygen atom compared to ribose in RNA."
                },
                {
                  question: "DNA replication is described as:",
                  optionA: "Conservative",
                  optionB: "Dispersive",
                  optionC: "Semi-conservative",
                  optionD: "Non-conservative",
                  correctAnswer: "C",
                  explanation: "DNA replication is semi-conservative - each new molecule has one old strand and one new strand."
                }
              ]
            },
            {
              title: "Human Evolution",
              topic: "Evolution",
              questions: [
                {
                  question: "Which species is considered the direct ancestor of Homo sapiens?",
                  optionA: "Homo habilis",
                  optionB: "Homo erectus",
                  optionC: "Australopithecus",
                  optionD: "Homo heidelbergensis",
                  correctAnswer: "D",
                  explanation: "Homo heidelbergensis is widely considered a direct ancestor of Homo sapiens."
                },
                {
                  question: "Bipedalism in early hominids first appeared in:",
                  optionA: "Homo sapiens",
                  optionB: "Australopithecus",
                  optionC: "Homo erectus",
                  optionD: "Homo habilis",
                  correctAnswer: "B",
                  explanation: "Australopithecus was one of the first hominids to walk upright (bipedalism)."
                },
                {
                  question: "What is the main evidence for human evolution from Africa?",
                  optionA: "All fossils found in Africa",
                  optionB: "Mitochondrial DNA analysis",
                  optionC: "Cultural artifacts only",
                  optionD: "Written records",
                  correctAnswer: "B",
                  explanation: "Mitochondrial DNA (mtDNA) analysis shows that all humans share a common African ancestor."
                },
                {
                  question: "Which tool-making culture is associated with Homo habilis?",
                  optionA: "Acheulean",
                  optionB: "Oldowan",
                  optionC: "Mousterian",
                  optionD: "Aurignacian",
                  correctAnswer: "B",
                  explanation: "Homo habilis is associated with the Oldowan tool culture - simple stone tools."
                },
                {
                  question: "What is the significance of the foramen magnum position in hominid evolution?",
                  optionA: "It indicates diet",
                  optionB: "It shows brain size",
                  optionC: "It indicates bipedalism",
                  optionD: "It shows tool use",
                  correctAnswer: "C",
                  explanation: "A centrally positioned foramen magnum indicates upright walking (bipedalism)."
                }
              ]
            }
          ]
        },
        {
          id: "geography",
          quizzes: [
            {
              title: "Tropical Cyclones",
              topic: "Climate and Weather",
              questions: [
                {
                  question: "At what minimum sea surface temperature can tropical cyclones form?",
                  optionA: "20 degrees Celsius",
                  optionB: "24 degrees Celsius",
                  optionC: "27 degrees Celsius",
                  optionD: "30 degrees Celsius",
                  correctAnswer: "C",
                  explanation: "Tropical cyclones require sea surface temperatures of at least 27 degrees Celsius to form."
                },
                {
                  question: "What is the calm centre of a tropical cyclone called?",
                  optionA: "Core",
                  optionB: "Eye",
                  optionC: "Centre",
                  optionD: "Hub",
                  correctAnswer: "B",
                  explanation: "The eye is the calm, low-pressure centre of a tropical cyclone with descending air."
                },
                {
                  question: "In which direction do tropical cyclones rotate in the Southern Hemisphere?",
                  optionA: "Anti-clockwise",
                  optionB: "Clockwise",
                  optionC: "No rotation",
                  optionD: "Varies",
                  correctAnswer: "B",
                  explanation: "Due to the Coriolis effect, tropical cyclones rotate clockwise in the Southern Hemisphere."
                },
                {
                  question: "What is the main source of energy for tropical cyclones?",
                  optionA: "Solar radiation",
                  optionB: "Latent heat from condensation",
                  optionC: "Ocean currents",
                  optionD: "Wind energy",
                  correctAnswer: "B",
                  explanation: "Tropical cyclones derive their energy from latent heat released during condensation of water vapour."
                },
                {
                  question: "What happens to a tropical cyclone when it moves over land?",
                  optionA: "It intensifies",
                  optionB: "It weakens and dissipates",
                  optionC: "It stays the same",
                  optionD: "It changes direction",
                  correctAnswer: "B",
                  explanation: "Without warm ocean water as an energy source, tropical cyclones weaken over land."
                }
              ]
            },
            {
              title: "Drainage Systems",
              topic: "Geomorphology",
              questions: [
                {
                  question: "What type of drainage pattern develops on uniformly resistant rock?",
                  optionA: "Dendritic",
                  optionB: "Trellis",
                  optionC: "Radial",
                  optionD: "Rectangular",
                  correctAnswer: "A",
                  explanation: "Dendritic (tree-like) drainage patterns develop on uniformly resistant rock with gentle slopes."
                },
                {
                  question: "A river's load is transported in three ways. Which is NOT one of them?",
                  optionA: "Solution",
                  optionB: "Suspension",
                  optionC: "Evaporation",
                  optionD: "Traction",
                  correctAnswer: "C",
                  explanation: "Rivers transport load by solution, suspension, and traction (rolling/sliding along the bed)."
                },
                {
                  question: "What is a meander?",
                  optionA: "A straight river channel",
                  optionB: "A curved bend in a river",
                  optionC: "A waterfall",
                  optionD: "A river delta",
                  correctAnswer: "B",
                  explanation: "A meander is a curved, winding bend in a river, typically found in the middle and lower courses."
                },
                {
                  question: "What landform is created when a meander is cut off?",
                  optionA: "Delta",
                  optionB: "Oxbow lake",
                  optionC: "Waterfall",
                  optionD: "Gorge",
                  correctAnswer: "B",
                  explanation: "When a meander is cut off, it forms an oxbow lake (or billabong)."
                },
                {
                  question: "In which part of a river is erosion most active?",
                  optionA: "Upper course",
                  optionB: "Middle course",
                  optionC: "Lower course",
                  optionD: "Mouth",
                  correctAnswer: "A",
                  explanation: "The upper course has steep gradients and high velocity, causing the most active erosion."
                }
              ]
            }
          ]
        },
        {
          id: "economics",
          quizzes: [
            {
              title: "Inflation",
              topic: "Macro-economics",
              questions: [
                {
                  question: "What is inflation?",
                  optionA: "A decrease in prices",
                  optionB: "A sustained increase in the general price level",
                  optionC: "An increase in production",
                  optionD: "A decrease in money supply",
                  correctAnswer: "B",
                  explanation: "Inflation is a sustained increase in the general price level over time."
                },
                {
                  question: "Which type of inflation is caused by increased production costs?",
                  optionA: "Demand-pull inflation",
                  optionB: "Cost-push inflation",
                  optionC: "Hyperinflation",
                  optionD: "Stagflation",
                  correctAnswer: "B",
                  explanation: "Cost-push inflation occurs when rising production costs cause prices to increase."
                },
                {
                  question: "What is the South African Reserve Bank's primary tool to combat inflation?",
                  optionA: "Taxation",
                  optionB: "Government spending",
                  optionC: "Interest rates (repo rate)",
                  optionD: "Exchange rate",
                  correctAnswer: "C",
                  explanation: "The SARB uses the repo rate (interest rates) as its main tool to control inflation."
                },
                {
                  question: "What is South Africa's inflation target range?",
                  optionA: "1-3%",
                  optionB: "3-6%",
                  optionC: "5-8%",
                  optionD: "2-5%",
                  correctAnswer: "B",
                  explanation: "South Africa's inflation target range is 3-6%."
                },
                {
                  question: "Who benefits from unexpected inflation?",
                  optionA: "Savers",
                  optionB: "Borrowers",
                  optionC: "Pensioners",
                  optionD: "Fixed income earners",
                  correctAnswer: "B",
                  explanation: "Borrowers benefit from unexpected inflation as they repay loans with money that is worth less."
                }
              ]
            },
            {
              title: "Perfect Markets",
              topic: "Micro-economics",
              questions: [
                {
                  question: "Which is NOT a characteristic of perfect competition?",
                  optionA: "Many buyers and sellers",
                  optionB: "Homogeneous products",
                  optionC: "Price maker",
                  optionD: "Free entry and exit",
                  correctAnswer: "C",
                  explanation: "In perfect competition, firms are price takers, not price makers."
                },
                {
                  question: "In perfect competition, what is the firm's demand curve?",
                  optionA: "Downward sloping",
                  optionB: "Upward sloping",
                  optionC: "Perfectly elastic (horizontal)",
                  optionD: "Perfectly inelastic (vertical)",
                  correctAnswer: "C",
                  explanation: "The demand curve is perfectly elastic because firms are price takers."
                },
                {
                  question: "What determines the market price in perfect competition?",
                  optionA: "Government",
                  optionB: "Largest firm",
                  optionC: "Market forces of supply and demand",
                  optionD: "Industry association",
                  correctAnswer: "C",
                  explanation: "In perfect competition, prices are determined by market forces of supply and demand."
                },
                {
                  question: "In the long run, firms in perfect competition earn:",
                  optionA: "Supernormal profits",
                  optionB: "Normal profits",
                  optionC: "Economic losses",
                  optionD: "Maximum profits",
                  correctAnswer: "B",
                  explanation: "Due to free entry/exit, long-run equilibrium results in only normal (zero economic) profits."
                },
                {
                  question: "Which market is closest to perfect competition?",
                  optionA: "Electricity market",
                  optionB: "Agricultural produce market",
                  optionC: "Smartphone market",
                  optionD: "Airline industry",
                  correctAnswer: "B",
                  explanation: "Agricultural markets (e.g., wheat, maize) come closest to perfect competition."
                }
              ]
            }
          ]
        },
        {
          id: "business-studies",
          quizzes: [
            {
              title: "Business Ethics",
              topic: "Professionalism and Ethics",
              questions: [
                {
                  question: "What is business ethics?",
                  optionA: "Making maximum profit",
                  optionB: "Moral principles guiding business conduct",
                  optionC: "Following only legal requirements",
                  optionD: "Avoiding all risks",
                  correctAnswer: "B",
                  explanation: "Business ethics are moral principles that guide business behavior and decision-making."
                },
                {
                  question: "What is corporate social responsibility (CSR)?",
                  optionA: "Paying taxes",
                  optionB: "A business's obligation to act in ways that benefit society",
                  optionC: "Marketing strategy",
                  optionD: "Hiring local workers",
                  correctAnswer: "B",
                  explanation: "CSR refers to a business's voluntary efforts to benefit society beyond legal requirements."
                },
                {
                  question: "Which is an example of unethical business practice?",
                  optionA: "Fair pricing",
                  optionB: "Environmental sustainability",
                  optionC: "Misleading advertising",
                  optionD: "Employee wellness programs",
                  correctAnswer: "C",
                  explanation: "Misleading advertising deceives consumers and is an unethical business practice."
                },
                {
                  question: "What is a code of ethics?",
                  optionA: "Legal contract",
                  optionB: "Document outlining expected moral behavior",
                  optionC: "Marketing plan",
                  optionD: "Financial statement",
                  correctAnswer: "B",
                  explanation: "A code of ethics is a document that outlines the expected moral behavior of employees."
                },
                {
                  question: "Which stakeholder is most directly affected by product quality?",
                  optionA: "Shareholders",
                  optionB: "Suppliers",
                  optionC: "Consumers",
                  optionD: "Government",
                  correctAnswer: "C",
                  explanation: "Consumers are most directly affected by product quality as they use the products."
                }
              ]
            },
            {
              title: "Human Resources",
              topic: "Human Resources Function",
              questions: [
                {
                  question: "What is the main purpose of recruitment?",
                  optionA: "Fire employees",
                  optionB: "Attract suitable candidates",
                  optionC: "Reduce salaries",
                  optionD: "Close departments",
                  correctAnswer: "B",
                  explanation: "Recruitment aims to attract a pool of suitable candidates for job vacancies."
                },
                {
                  question: "What is the difference between induction and training?",
                  optionA: "They are the same",
                  optionB: "Induction introduces new employees; training develops skills",
                  optionC: "Training is for managers only",
                  optionD: "Induction is only for executives",
                  correctAnswer: "B",
                  explanation: "Induction introduces new employees to the company; training develops specific skills."
                },
                {
                  question: "What is performance appraisal?",
                  optionA: "Salary increase",
                  optionB: "Systematic evaluation of employee performance",
                  optionC: "Recruitment process",
                  optionD: "Retirement planning",
                  correctAnswer: "B",
                  explanation: "Performance appraisal is a systematic evaluation of employee performance against set standards."
                },
                {
                  question: "Which legislation protects workers' rights in South Africa?",
                  optionA: "Companies Act",
                  optionB: "Labour Relations Act",
                  optionC: "Consumer Protection Act",
                  optionD: "National Credit Act",
                  correctAnswer: "B",
                  explanation: "The Labour Relations Act (LRA) protects workers' rights in South Africa."
                },
                {
                  question: "What is BBBEE in the South African context?",
                  optionA: "Business Banking Economic Empowerment",
                  optionB: "Broad-Based Black Economic Empowerment",
                  optionC: "Basic Business Education and Empowerment",
                  optionD: "Building Better Business Economic Environment",
                  correctAnswer: "B",
                  explanation: "BBBEE stands for Broad-Based Black Economic Empowerment."
                }
              ]
            }
          ]
        }
      ];

      for (const subject of theorySubjects) {
        for (const quizData of subject.quizzes) {
          const quiz = await storage.createQuiz(subject.id, quizData.title, quizData.topic);
          for (const q of quizData.questions) {
            await storage.createQuizQuestion(
              quiz.id,
              q.question,
              q.optionA,
              q.optionB,
              q.optionC,
              q.optionD,
              q.correctAnswer,
              q.explanation
            );
          }
        }
      }

      res.json({ message: "Quizzes seeded successfully" });
    } catch (error) {
      console.error("Error seeding quizzes:", error);
      res.status(500).json({ message: "Failed to seed quizzes" });
    }
  });

  return httpServer;
}
