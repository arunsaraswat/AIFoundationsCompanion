import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CourseProgressProvider } from "./contexts/CourseProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ExerciseProvider } from "./contexts/ExerciseContext";
import Layout from "./components/Layout";
import CourseProgress from "./pages/CourseProgress";
import ModelMatchUp from "./pages/ModelMatchUp";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CourseProgress} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <CourseProgressProvider>
            <Layout>
              <Toaster />
              <Router />
            </Layout>
          </CourseProgressProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
