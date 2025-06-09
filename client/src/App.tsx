import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CourseProgressProvider } from "./contexts/CourseProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LessonPage from "./pages/LessonPage";
import ModelMatchUpPage from "./pages/ModelMatchUpPage";
import AgentDesignPage from "./pages/AgentDesignPage";
import WorkflowEnhancerPage from "./pages/WorkflowEnhancerPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/lesson/:id">
        {(params) => <LessonPage lessonId={parseInt(params.id)} />}
      </Route>
      <Route path="/exercise/model-match-up" component={ModelMatchUpPage} />
      <Route path="/exercise/agent-design" component={AgentDesignPage} />
      <Route path="/exercise/workflow-enhancer" component={WorkflowEnhancerPage} />
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
