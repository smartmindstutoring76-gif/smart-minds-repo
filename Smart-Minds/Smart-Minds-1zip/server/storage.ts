import { users, subscriptions, quizzes, quizQuestions, quizAttempts, type User, type InsertUser, type Subscription, type Quiz, type QuizQuestion, type QuizAttempt } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPaidStatus(userId: string, isPaid: boolean): Promise<User | undefined>;
  updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User | undefined>;
  
  createSubscription(userId: string, stripeSubscriptionId: string, subjects: string[]): Promise<Subscription>;
  getSubscriptionByUserId(userId: string): Promise<Subscription | undefined>;
  updateSubscriptionStatus(subscriptionId: string, status: string): Promise<Subscription | undefined>;
  
  getQuizzesBySubject(subjectId: string): Promise<Quiz[]>;
  getQuizById(quizId: string): Promise<Quiz | undefined>;
  getQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]>;
  createQuiz(subjectId: string, title: string, topic: string): Promise<Quiz>;
  createQuizQuestion(quizId: string, question: string, optionA: string, optionB: string, optionC: string, optionD: string, correctAnswer: string, explanation?: string): Promise<QuizQuestion>;
  
  createQuizAttempt(userId: string, quizId: string, score: number, totalQuestions: number): Promise<QuizAttempt>;
  getQuizAttemptsByUser(userId: string): Promise<QuizAttempt[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPaidStatus(userId: string, isPaid: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isPaid })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserStripeCustomerId(userId: string, stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async createSubscription(userId: string, stripeSubscriptionId: string, subjects: string[]): Promise<Subscription> {
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        stripeSubscriptionId,
        subjects,
        status: "active",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .returning();
    return subscription;
  }

  async getSubscriptionByUserId(userId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return subscription || undefined;
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .update(subscriptions)
      .set({ status })
      .where(eq(subscriptions.id, subscriptionId))
      .returning();
    return subscription || undefined;
  }

  async getQuizzesBySubject(subjectId: string): Promise<Quiz[]> {
    return db.select().from(quizzes).where(eq(quizzes.subjectId, subjectId));
  }

  async getQuizById(quizId: string): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, quizId));
    return quiz || undefined;
  }

  async getQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  }

  async createQuiz(subjectId: string, title: string, topic: string): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values({ subjectId, title, topic })
      .returning();
    return quiz;
  }

  async createQuizQuestion(
    quizId: string,
    question: string,
    optionA: string,
    optionB: string,
    optionC: string,
    optionD: string,
    correctAnswer: string,
    explanation?: string
  ): Promise<QuizQuestion> {
    const [quizQuestion] = await db
      .insert(quizQuestions)
      .values({
        quizId,
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
      })
      .returning();
    return quizQuestion;
  }

  async createQuizAttempt(userId: string, quizId: string, score: number, totalQuestions: number): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values({ userId, quizId, score, totalQuestions })
      .returning();
    return attempt;
  }

  async getQuizAttemptsByUser(userId: string): Promise<QuizAttempt[]> {
    return db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));
  }
}

export const storage = new DatabaseStorage();
