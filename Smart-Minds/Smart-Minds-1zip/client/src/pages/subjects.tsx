import { motion } from "framer-motion";
import { subjects } from "@/lib/data";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, FileText, ChevronDown } from "lucide-react";
import { Link, useRoute } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Subjects() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [match, params] = useRoute("/subjects/:id");
  const selectedSubject = params?.id ? subjects.find(s => s.id === params.id) : null;

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">
              Our Subjects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive Grade 12 curriculum coverage. Select a subject to view the detailed breakdown.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 flex flex-col">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${subject.color}`}>
                      <subject.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-heading">{subject.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium">Paper 1:</span> {subject.paper1}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground p-2 bg-muted/50 rounded-md">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="font-medium">Paper 2:</span> {subject.paper2}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full group" variant="outline">
                          View Content
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${subject.color}`}>
                            <subject.icon className="w-5 h-5" />
                          </div>
                          <DialogTitle className="text-2xl font-heading">{subject.title}</DialogTitle>
                          <DialogDescription>
                            Detailed breakdown of chapters and topics for {subject.title}.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="mt-6">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="paper1">
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left">
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">Paper 1</Badge>
                                  <span className="font-bold text-lg">{subject.paper1}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                  {subject.content.paper1.map((chapter, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40" />
                                      <span>{chapter}</span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="paper2">
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-2 text-left">
                                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Paper 2</Badge>
                                  <span className="font-bold text-lg">{subject.paper2}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-2 pl-2">
                                  {subject.content.paper2.map((chapter, i) => (
                                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/40" />
                                      <span>{chapter}</span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                        
                        <div className="mt-6 flex justify-end">
                          <Link href="/register">
                            <Button>Subscribe to {subject.title}</Button>
                          </Link>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            Ready to improve your marks?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Get full access to all subjects and live lessons for just R250 per month per subject.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-primary font-bold px-8 py-6 text-lg h-auto shadow-xl hover:shadow-2xl transition-all">
              Start Learning Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
