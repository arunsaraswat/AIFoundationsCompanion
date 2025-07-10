import { lesson1 } from './lessons/lesson-1';
import { lesson2 } from './lessons/lesson-2';
import { lesson3 } from './lessons/lesson-3';
import { lesson4 } from './lessons/lesson-4';
import { lesson5 } from './lessons/lesson-5';
import { lesson6 } from './lessons/lesson-6';
import type { Lesson } from '../client/src/contexts/CourseProgressContext';

export const courseContent = {
  lessons: [lesson1, lesson2, lesson3, lesson4, lesson5, lesson6] as Lesson[],
  metadata: {
    version: "1.0",
    totalLessons: 6,
    estimatedDuration: "20 hours",
    lastUpdated: new Date().toISOString()
  }
};

// Async loader for future dynamic imports
export async function loadCourseContent() {
  return courseContent;
}

// Individual lesson loader for potential lazy loading
export async function loadLesson(lessonId: number): Promise<Lesson | null> {
  try {
    /* @vite-ignore */
    const lessonModule = await import(`./lessons/lesson-${lessonId}.ts`);
    return lessonModule[`lesson${lessonId}`] || null;
  } catch (error) {
    console.error(`Failed to load lesson ${lessonId}:`, error);
    return null;
  }
}

// Utility to get lesson by ID from loaded content
export function getLessonById(lessonId: number): Lesson | undefined {
  return courseContent.lessons.find(lesson => lesson.id === lessonId);
}

// Export individual lessons for direct access
export { lesson1, lesson2, lesson3, lesson4, lesson5, lesson6 };