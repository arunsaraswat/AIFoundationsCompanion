import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CourseProgressProvider } from "./contexts/CourseProgressContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PdfViewerProvider } from "./contexts/PdfViewerContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LessonPage from "./pages/LessonPage";
import ModelMatchUpPage from "./pages/ModelMatchUpPage";
import AgentDesignPage from "./pages/AgentDesignPage";
import WorkflowRedesignPage from "./pages/WorkflowRedesignPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/lesson/:id/:subLessonId?">
        {(params) => <LessonPage lessonId={parseInt(params.id)} subLessonId={params.subLessonId} />}
      </Route>
      <Route path="/exercise/model-match-up/:lessonId?/:subLessonId?">
        {(params) => <ModelMatchUpPage lessonId={params.lessonId ? parseInt(params.lessonId) : undefined} subLessonId={params.subLessonId} />}
      </Route>
      <Route path="/exercise/agent-design/:lessonId?/:subLessonId?">
        {(params) => <AgentDesignPage lessonId={params.lessonId ? parseInt(params.lessonId) : undefined} subLessonId={params.subLessonId} />}
      </Route>
      <Route path="/exercise/workflow-enhancer/:lessonId?/:subLessonId?">
        {() => <WorkflowRedesignPage />}
      </Route>
      {/* Backward compatibility routes */}
      <Route path="/exercise/model-match-up">
        {() => <ModelMatchUpPage />}
      </Route>
      <Route path="/exercise/agent-design">
        {() => <AgentDesignPage />}
      </Route>
      <Route path="/exercise/workflow-enhancer">
        {() => <WorkflowRedesignPage />}
      </Route>
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
            <PdfViewerProvider>
              <Layout>
                <Toaster />
                <Router />
              </Layout>
            </PdfViewerProvider>
          </CourseProgressProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
