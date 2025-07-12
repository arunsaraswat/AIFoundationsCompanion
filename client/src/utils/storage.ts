import type { Lesson } from "../contexts/CourseProgressContext";

const STORAGE_KEY = "ai-native-foundations-progress";

export function saveCourseData(lessons: Lesson[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lessons }));
  } catch (error) {
    console.error("Failed to save course data:", error);
  }
}

export function loadCourseData(): Lesson[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return parsed.lessons || null;
  } catch (error) {
    console.error("Failed to load course data:", error);
    return null;
  }
}

export function clearCourseData(): void {
  // Clear main course data
  localStorage.removeItem(STORAGE_KEY);
  
  // Clear exercise-specific data
  localStorage.removeItem("modelMatchUpData");
  localStorage.removeItem("modelMatchUpTask2");
  localStorage.removeItem("modelMatchUpTask3");
  localStorage.removeItem("tokenPredictionState");
  
  // Clear all prompt anatomy, quick decision prompt, checkbox state, RISE prompt, RAG exercise, agent design, workflow redesign, and AI response data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("promptAnatomy_") || 
        key.startsWith("quickDecisionPrompt_") || 
        key.startsWith("quickDecisionCheckbox_") ||
        key.startsWith("quickDecisionAI_") ||
        key.startsWith("risePrompt_") ||
        key.startsWith("risePromptCheckbox_") ||
        key.startsWith("risePromptAI_") ||
        key.startsWith("riseExecutionAI_") ||
        key.startsWith("tokenPredictionAI_") ||
        key.startsWith("ragStep1_") ||
        key.startsWith("ragStep1AI_") ||
        key.startsWith("ragStep2_") ||
        key.startsWith("ragStep2AI_") ||
        key.startsWith("ragTestQuestions_") ||
        key.startsWith("ragTestQuestionsAI_") ||
        key.startsWith("agentDesignStep1_") ||
        key.startsWith("agentDesignStep2_") ||
        key.startsWith("workflowRedesign_") ||
        key === "workflow-diagram") {
      localStorage.removeItem(key);
    }
  });

  // Call global reset function for TokenPrediction component if it exists
  if (typeof (window as any).resetTokenPrediction === 'function') {
    (window as any).resetTokenPrediction();
  }

  // Dispatch custom event to notify components about data clearing
  window.dispatchEvent(new CustomEvent('clearAllData'));
}
