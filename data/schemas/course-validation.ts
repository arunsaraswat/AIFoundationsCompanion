import type { Lesson } from '../../client/src/contexts/CourseProgressContext';

/**
 * Validates that the provided data structure matches the expected Lesson array format
 */
export function validateCourseContent(data: unknown): data is Lesson[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(lesson => {
    if (typeof lesson !== 'object' || lesson === null) {
      return false;
    }

    const l = lesson as any;
    
    // Check required lesson properties
    if (typeof l.id !== 'number' || typeof l.title !== 'string' || !Array.isArray(l.subLessons)) {
      return false;
    }

    // Validate sub-lessons
    return l.subLessons.every((subLesson: any) => {
      if (typeof subLesson !== 'object' || subLesson === null) {
        return false;
      }

      // Check required sub-lesson properties
      if (typeof subLesson.id !== 'string' || 
          typeof subLesson.title !== 'string' || 
          typeof subLesson.completed !== 'boolean') {
        return false;
      }

      // Validate exercises if present
      if (subLesson.exercises && !Array.isArray(subLesson.exercises)) {
        return false;
      }

      return true;
    });
  });
}

/**
 * Validates that a single lesson has the correct structure
 */
export function validateLesson(data: unknown): data is Lesson {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const lesson = data as any;
  return typeof lesson.id === 'number' && 
         typeof lesson.title === 'string' && 
         Array.isArray(lesson.subLessons);
}