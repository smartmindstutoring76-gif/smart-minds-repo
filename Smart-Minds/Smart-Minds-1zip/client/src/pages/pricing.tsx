import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pricingFeatures } from "@/lib/data";
import { CheckCircle2, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Pricing() {
  return (
    <Layout>
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              Simple, Affordable Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invest in your future for less than the cost of a textbook.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-primary/20 shadow-2xl overflow-hidden relative">
                
                <CardHeader className="text-center pt-10 pb-2">
                  <CardTitle className="text-3xl font-heading">Single Subject</CardTitle>
                  <CardDescription>Full access to one subject of your choice</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <div className="flex flex-col items-center justify-center mb-6">
                    <span className="text-5xl font-bold text-primary">R250</span>
                    <span className="text-muted-foreground mt-2 font-medium">per month per subject</span>
                  </div>
                  
                  <div className="space-y-4 text-left px-4 md:px-8">
                    {pricingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pb-10 px-8">
                  <Link href="/register" className="w-full">
                    <Button size="lg" className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20">
                      Subscribe Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
            
            <p className="text-center text-muted-foreground mt-8 text-sm">
              Need multiple subjects? Add as many as you need during checkout.
              <br />Cancel anytime. No long-term contracts.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border bg-white px-4 rounded-lg">
              <AccordionTrigger className="font-medium text-lg hover:text-primary hover:no-underline">
                Can I cancel my subscription anytime?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, absolutely. You can cancel your subscription at any time from your dashboard. Your access will continue until the end of your current billing cycle.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border bg-white px-4 rounded-lg">
              <AccordionTrigger className="font-medium text-lg hover:text-primary hover:no-underline">
                Are the lessons live or recorded?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Both! You get access to our library of pre-recorded lessons covering the entire curriculum, PLUS weekly live interactive lessons where you can ask questions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border bg-white px-4 rounded-lg">
              <AccordionTrigger className="font-medium text-lg hover:text-primary hover:no-underline">
                Can I access Smart Minds on my phone?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes, our platform is fully mobile-optimized. You can watch lessons, take quizzes, and download notes from your smartphone, tablet, or laptop.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
