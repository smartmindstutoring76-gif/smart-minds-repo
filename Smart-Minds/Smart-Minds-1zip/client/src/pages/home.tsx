import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, PlayCircle, Users } from "lucide-react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { features, subjects } from "@/lib/data";
import heroBg from "@assets/generated_images/abstract_educational_hero_background_with_math/science_elements.png";
import studentImg from "@assets/generated_images/high_school_student_studying_on_laptop.png";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-background" />
        </div>

        <div className="container relative z-10 px-4 py-16 text-center md:text-left md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-sm">
                <span className="text-secondary font-semibold text-sm tracking-wide uppercase">Matric Support</span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6">
                Unlock Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Full Potential</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                Comprehensive video lessons and live classes for Matric learners. 
                Master your subjects with South Africa's newest digital learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="text-lg font-bold px-8 py-6 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 text-white border-none">
                    Get Started Now
                  </Button>
                </Link>
                <Link href="/subjects">
                  <Button size="lg" variant="outline" className="text-lg font-bold px-8 py-6 bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
                    View Subjects
                  </Button>
                </Link>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>CAPS Aligned</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>Expert Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  <span>24/7 Access</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Visual/Card - Optional, maybe just text is enough, but let's add a glass card */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden md:block relative md:pl-12"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-accent rounded-2xl blur-lg opacity-30 animate-pulse" />
              <Card className="relative bg-white/10 border-white/10 backdrop-blur-md text-white overflow-hidden shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <p className="text-sm text-gray-300 uppercase tracking-wider font-semibold">Next Live Lesson</p>
                      <h3 className="text-2xl font-heading font-bold mt-1">Physical Sciences</h3>
                    </div>
                    <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="h-10 w-10 rounded bg-blue-500/20 flex items-center justify-center">
                        <span className="font-bold text-blue-300">M</span>
                      </div>
                      <div>
                        <p className="font-medium">Maths & Business Studies</p>
                        <p className="text-xs text-gray-400">Monday, 18:00 - 20:00</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="h-10 w-10 rounded bg-emerald-500/20 flex items-center justify-center">
                        <span className="font-bold text-emerald-300">AL</span>
                      </div>
                      <div>
                        <p className="font-medium">Accounting & Life Sciences</p>
                        <p className="text-xs text-gray-400">Monday, 20:00 - 22:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
              Everything you need to ace Matric
            </h2>
            <p className="text-lg text-muted-foreground">
              Smart Minds provides a complete ecosystem for learning, practice, and revision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Section */}
      <section className="py-20 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">
                Structured exactly like your curriculum
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                Don't waste time searching for relevant content. Every subject is divided into Paper 1 and Paper 2, broken down into correct chapters and topics aligned with CAPS.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto text-left">
                {[
                  "Chapters arranged in exam-board order",
                  "Subtopics for deep understanding",
                  "Lesson summaries, notes & examples",
                  "Worked examples for calculations"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-border/50 shadow-sm">
                    <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-foreground/90">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/subjects">
                <Button size="lg" className="font-bold shadow-lg shadow-primary/10 px-8 py-6 text-lg">
                  Explore Subjects
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Subjects Preview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-2">Top Subjects</h2>
              <p className="text-muted-foreground">Most popular choices among our learners</p>
            </div>
            <Link href="/subjects">
              <Button variant="ghost" className="hidden md:flex group">
                View All Subjects <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.slice(0, 4).map((subject, index) => (
              <Link key={subject.id} href={`/subjects`}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full cursor-pointer"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
                    <CardHeader>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${subject.color}`}>
                        <subject.icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-lg">{subject.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {subject.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/subjects">
              <Button variant="outline" className="w-full">View All Subjects</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
