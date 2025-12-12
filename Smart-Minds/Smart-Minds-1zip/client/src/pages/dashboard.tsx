import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { BookOpen, Video, Users, Trophy, LogOut, Loader2, PlayCircle } from "lucide-react";
import { subjects } from "@/lib/data";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isPaid: boolean;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  subjectId: string;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [quizzes, setQuizzes] = useState<Record<string, Quiz[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          setLocation("/login");
          return;
        }
        const data = await response.json();
        setUser(data.user);

        const theorySubjects = ["life-sciences", "geography", "economics", "business-studies"];
        for (const subjectId of theorySubjects) {
          const quizResponse = await fetch(`/api/quizzes/${subjectId}`);
          if (quizResponse.ok) {
            const quizData = await quizResponse.json();
            setQuizzes((prev) => ({ ...prev, [subjectId]: quizData }));
          }
        }
      } catch (error) {
        setLocation("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  const theorySubjectsData = subjects.filter((s) =>
    ["life-sciences", "geography", "economics", "business-studies"].includes(s.id)
  );

  return (
    <Layout>
      <section className="py-8 md:py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold">Welcome, {user.name}!</h1>
              <p className="text-muted-foreground">Continue your learning journey</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Video className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">120+</p>
                    <p className="text-sm text-muted-foreground">Video Lessons</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">Live</p>
                    <p className="text-sm text-muted-foreground">Classes Weekly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Practice Quizzes</h2>
            <p className="text-muted-foreground mb-6">
              Test your knowledge with multiple choice quizzes for theory subjects
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {theorySubjectsData.map((subject) => (
                <motion.div
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${subject.color} flex items-center justify-center`}>
                          <subject.icon className="w-5 h-5" />
                        </div>
                        {subject.title}
                      </CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {quizzes[subject.id] && quizzes[subject.id].length > 0 ? (
                        <div className="space-y-2">
                          {quizzes[subject.id].map((quiz) => (
                            <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
                              <Button variant="outline" className="w-full justify-start">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                {quiz.title}
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {quiz.topic}
                                </span>
                              </Button>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No quizzes available yet. Check back soon!
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-bold mb-4">All Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {subjects.map((subject) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 rounded-lg ${subject.color} flex items-center justify-center mb-4`}>
                      <subject.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{subject.title}</h3>
                    <p className="text-sm text-muted-foreground">{subject.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
