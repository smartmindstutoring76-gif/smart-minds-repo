import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "wouter";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string | null;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  subjectId: string;
}

interface AnswerResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

export default function QuizPage() {
  const params = useParams<{ quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AnswerResult[] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${params.quizId}`);
        const data = await response.json();
        setQuiz(data.quiz);
        setQuestions(data.questions);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.quizId) {
      fetchQuiz();
    }
  }, [params.quizId]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentResult = results?.find((r) => r.questionId === currentQuestion?.id);

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/quiz/${params.quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      setResults(data.results);
      setScore(data.score);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setResults(null);
    setScore(null);
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? "border-primary bg-primary/10"
        : "border-border hover:border-primary/50";
    }

    const isCorrect = option === currentQuestion.correctAnswer;
    const isSelected = selectedAnswer === option;

    if (isCorrect) {
      return "border-green-500 bg-green-50";
    }
    if (isSelected && !isCorrect) {
      return "border-red-500 bg-red-50";
    }
    return "border-border opacity-50";
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

  if (!quiz || questions.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-heading font-bold mb-2">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-6">This quiz doesn't exist or has no questions.</p>
          <Link href="/subjects">
            <Button>Browse Subjects</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (score !== null) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Layout>
        <section className="py-16 md:py-24 bg-muted/30 min-h-[80vh]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <Card className="border-primary/20 shadow-2xl">
                <CardHeader>
                  <div
                    className={cn(
                      "mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4",
                      percentage >= 80
                        ? "bg-green-100"
                        : percentage >= 50
                        ? "bg-yellow-100"
                        : "bg-red-100"
                    )}
                  >
                    {percentage >= 80 ? (
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    ) : percentage >= 50 ? (
                      <span className="text-4xl">🎯</span>
                    ) : (
                      <span className="text-4xl">📚</span>
                    )}
                  </div>
                  <CardTitle className="text-3xl font-heading">
                    {percentage >= 80
                      ? "Excellent Work!"
                      : percentage >= 50
                      ? "Good Effort!"
                      : "Keep Practicing!"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{percentage}%</div>
                    <p className="text-muted-foreground">
                      You got {score} out of {questions.length} questions correct
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold mb-3">Question Summary:</h4>
                    <div className="space-y-2">
                      {results?.map((result, index) => (
                        <div
                          key={result.questionId}
                          className="flex items-center gap-2 text-sm"
                        >
                          {result.isCorrect ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                          )}
                          <span className={result.isCorrect ? "text-green-700" : "text-red-700"}>
                            Question {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleRestart} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Link href="/subjects" className="flex-1">
                      <Button className="w-full">More Quizzes</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-muted/30 min-h-[80vh]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-heading font-bold">{quiz.title}</h1>
                <span className="text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-primary/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl leading-relaxed">
                      {currentQuestion.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {["A", "B", "C", "D"].map((letter) => {
                      const optionKey = `option${letter}` as keyof Question;
                      const optionText = currentQuestion[optionKey] as string;
                      const isCorrect = letter === currentQuestion.correctAnswer;
                      const isSelected = selectedAnswer === letter;

                      return (
                        <button
                          key={letter}
                          onClick={() => handleSelectAnswer(letter)}
                          disabled={showResult}
                          className={cn(
                            "w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all",
                            getOptionClass(letter),
                            !showResult && "cursor-pointer hover:shadow-md"
                          )}
                        >
                          <span
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
                              showResult && isCorrect
                                ? "bg-green-500 text-white"
                                : showResult && isSelected && !isCorrect
                                ? "bg-red-500 text-white"
                                : "bg-muted"
                            )}
                          >
                            {showResult && isCorrect ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : showResult && isSelected && !isCorrect ? (
                              <XCircle className="w-5 h-5" />
                            ) : (
                              letter
                            )}
                          </span>
                          <span className="flex-1">{optionText}</span>
                        </button>
                      );
                    })}

                    {showResult && currentQuestion.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="text-sm text-blue-800">
                          <strong>Explanation:</strong> {currentQuestion.explanation}
                        </p>
                      </motion.div>
                    )}

                    {showResult && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="pt-4"
                      >
                        <Button onClick={handleNext} className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : isLastQuestion ? (
                            "See Results"
                          ) : (
                            <>
                              Next Question
                              <ChevronRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
