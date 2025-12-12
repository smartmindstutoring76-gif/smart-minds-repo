import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";
import { subjects } from "@/lib/data";

export default function Register() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"register" | "subjects">("register");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const existingUserId = params.get("userId");
    if (existingUserId) {
      setUserId(existingUserId);
      setStep("subjects");
    }
  }, [search]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setUserId(data.userId);
      setStep("subjects");
      toast({
        title: "Account Created!",
        description: "Now select your subjects to complete registration.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handlePayment = async () => {
    if (selectedSubjects.length === 0) {
      toast({
        title: "Select at least one subject",
        description: "Please choose the subjects you want to subscribe to.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subjects: selectedSubjects,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Payment system not available",
          description: "Please contact support at tsmartminds@gmail.com",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = selectedSubjects.length * 250;

  return (
    <Layout>
      <section className="py-16 md:py-24 bg-muted/30 min-h-[80vh]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {step === "register" ? (
              <Card className="border-primary/20 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-heading">Create Your Account</CardTitle>
                  <CardDescription>
                    Join thousands of learners improving their matric results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., 081 234 5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                      Log In
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-primary/20 shadow-2xl">
                <CardHeader className="text-center space-y-2">
                  <CardTitle className="text-2xl font-heading">Select Your Subjects</CardTitle>
                  <CardDescription>
                    Choose the subjects you want to subscribe to. R250 per subject per month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedSubjects.includes(subject.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleSubjectToggle(subject.id)}
                      >
                        <Checkbox
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{subject.title}</p>
                          <p className="text-sm text-muted-foreground">R250/month</p>
                        </div>
                        {selectedSubjects.includes(subject.id) && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total Monthly Cost:</span>
                      <span className="text-primary">R{totalPrice}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedSubjects.length} subject(s) selected
                    </p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full"
                    disabled={isLoading || selectedSubjects.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay R${totalPrice} and Start Learning`
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground mt-4">
                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                    Cancel anytime.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
