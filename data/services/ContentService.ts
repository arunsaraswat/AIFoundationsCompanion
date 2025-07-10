import { courseContent, loadCourseContent, loadLesson, getLessonById } from '../course-content';
import { validateCourseContent, validateLesson } from '../schemas/course-validation';
import type { Lesson } from '../../client/src/contexts/CourseProgressContext';

/**
 * ContentService handles all course content loading, validation, and management
 */
export class ContentService {
  private static content: typeof courseContent | null = null;
  private static isLoading = false;

  /**
   * Load the complete course content with validation
   */
  static async loadCourse(): Promise<Lesson[]> {
    if (this.content) {
      return this.content.lessons;
    }

    if (this.isLoading) {
      // Wait for existing load to complete
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading && this.content) {
            clearInterval(checkInterval);
            resolve(this.content.lessons);
          }
        }, 10);
      });
    }

    try {
      this.isLoading = true;
      const content = await loadCourseContent();
      
      if (!validateCourseContent(content.lessons)) {
        throw new Error('Invalid course content structure');
      }

      this.content = content;
      return content.lessons;
    } catch (error) {
      console.error('Failed to load course content:', error);
      throw new Error('Course content could not be loaded');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Load a specific lesson by ID with validation
   */
  static async loadLessonById(id: number): Promise<Lesson | null> {
    try {
      const lesson = await loadLesson(id);
      
      if (lesson && !validateLesson(lesson)) {
        console.error(`Invalid lesson structure for lesson ${id}`);
        return null;
      }

      return lesson;
    } catch (error) {
      console.error(`Failed to load lesson ${id}:`, error);
      return null;
    }
  }

  /**
   * Get a lesson from already loaded content (synchronous)
   */
  static getLessonFromCache(id: number): Lesson | undefined {
    if (!this.content) {
      console.warn('Course content not loaded. Call loadCourse() first.');
      return undefined;
    }

    return getLessonById(id);
  }

  /**
   * Get course metadata
   */
  static getCourseMetadata() {
    return this.content?.metadata || {
      version: "1.0",
      totalLessons: 6,
      estimatedDuration: "20 hours",
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Clear cached content (useful for testing or forced refresh)
   */
  static clearCache(): void {
    this.content = null;
    this.isLoading = false;
  }

  /**
   * Check if content is currently loading
   */
  static isContentLoading(): boolean {
    return this.isLoading;
  }
}