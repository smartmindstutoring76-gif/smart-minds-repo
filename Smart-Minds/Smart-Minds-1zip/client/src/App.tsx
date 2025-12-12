import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Subjects from "@/pages/subjects";
import Pricing from "@/pages/pricing";
import LiveLessons from "@/pages/live-lessons";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import QuizPage from "@/pages/quiz";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/subjects" component={Subjects} />
      <Route path="/subjects/:id" component={Subjects} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/live-lessons" component={LiveLessons} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/quiz/:quizId" component={QuizPage} />
      <Route path="/payment-success" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
