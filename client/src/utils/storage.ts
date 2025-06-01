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
}
