import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen } from "lucide-react";

export default function LiveLessons() {
  const schedule = [
    {
      day: "Monday",
      slots: [
        { time: "18:00 - 20:00", subjects: ["Mathematics", "Business Studies"] },
        { time: "20:00 - 22:00", subjects: ["Accounting", "Life Sciences"] }
      ]
    },
    {
      day: "Tuesday",
      slots: [
        { time: "18:00 - 20:00", subjects: ["Accounting", "Geography"] },
        { time: "20:00 - 22:00", subjects: ["Math Literacy", "Physical Sciences"] },
        { time: "22:00 - 23:00", subjects: ["Economics"] }
      ]
    },
    {
      day: "Wednesday",
      slots: [
        { time: "18:00 - 20:00", subjects: ["Economics", "Physical Sciences"] },
        { time: "20:00 - 22:00", subjects: ["Geography", "Mathematics"] }
      ]
    },
    {
      day: "Thursday",
      slots: [
        { time: "18:00 - 20:00", subjects: ["Math Literacy", "Physical Sciences"] },
        { time: "20:00 - 22:00", subjects: ["Life Sciences", "Accounting"] }
      ]
    },
    {
      day: "Friday",
      slots: [
        { time: "18:00 - 20:00", subjects: ["Business Studies", "Economics", "Life Sciences"] },
        { time: "20:00 - 22:00", subjects: ["Mathematics", "Math Literacy"] }
      ]
    }
  ];

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
              Live Schedules
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our expert teachers for interactive live sessions. Check the weekly schedule below.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedule.map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-primary/5 border-b border-border/50 pb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl font-heading text-primary">{day.day}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {day.slots.map((slot, i) => (
                        <div key={i} className="relative pl-4 border-l-2 border-secondary/30">
                          <div className="flex items-center gap-2 text-sm font-bold text-secondary mb-1">
                            <Clock className="w-3 h-3" />
                            {slot.time}
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {slot.subjects.map((subject, j) => (
                              <Badge key={j} variant="outline" className="bg-background/50 border-primary/20">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
