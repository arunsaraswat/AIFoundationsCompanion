import { createContext, useContext, useEffect, useState } from "react";
import { loadCourseData, saveCourseData } from "../utils/storage";
import { ContentService } from "../../../data/services/ContentService";

export interface SubLesson {
  id: string;
  title: string;
  completed: boolean;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type:
    | "text"
    | "textarea"
    | "date"
    | "radio"
    | "select"
    | "checkbox"
    | "multi-step"
    | "radio-with-text"
    | "component"
    | "link";
  label: string;
  description?: string;
  options?: string[];
  steps?: Exercise[];
  answer?: string | string[];
  followUpAnswer?: string;
  followUpLabel?: string;
  followUpDescription?: string;
  component?: string;
  link?: string;
}

export interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

interface CourseProgressContextType {
  lessons: Lesson[];
  isLoading: boolean;
  updateSubLessonStatus: (
    lessonId: number,
    subLessonId: string,
    completed: boolean,
  ) => void;
  updateExerciseAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string | string[],
  ) => void;
  updateFollowUpAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string,
  ) => void;
  updateStepAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    stepId: string,
    answer: string,
  ) => void;
  getOverallProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
  getLessonProgress: (lessonId: number) => {
    completed: number;
    total: number;
    isCompleted: boolean;
  };
  exportData: () => string;
  importData: (data: string) => void;
}

const CourseProgressContext = createContext<
  CourseProgressContextType | undefined
>(undefined);

export function CourseProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = loadCourseData();
    if (saved) return saved;
    
    // Initialize with empty array, will be loaded asynchronously
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load course content on mount
  useEffect(() => {
    if (lessons.length === 0) {
      setIsLoading(true);
      ContentService.loadCourse()
        .then((courseData) => {
          setLessons(courseData);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Failed to load course content:', error);
          setIsLoading(false);
          // Fallback to empty lessons array or handle error as needed
        });
    }
  }, []);

  useEffect(() => {
    saveCourseData(lessons);
  }, [lessons]);

  const updateSubLessonStatus = (
    lessonId: number,
    subLessonId: string,
    completed: boolean,
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? { ...subLesson, completed }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateExerciseAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string | string[],
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? { ...exercise, answer }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateFollowUpAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string,
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? { ...exercise, followUpAnswer: answer }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateStepAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    stepId: string,
    answer: string,
  ) => {
    const updateStepsRecursively = (steps: Exercise[]): Exercise[] => {
      return steps.map((step) => {
        if (step.id === stepId) {
          return { ...step, answer };
        }
        if (step.steps) {
          return {
            ...step,
            steps: updateStepsRecursively(step.steps),
          };
        }
        return step;
      });
    };

    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? {
                              ...exercise,
                              steps: exercise.steps
                                ? updateStepsRecursively(exercise.steps)
                                : exercise.steps,
                            }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const getOverallProgress = () => {
    const total = lessons.reduce(
      (acc, lesson) => acc + lesson.subLessons.length,
      0,
    );
    const completed = lessons.reduce(
      (acc, lesson) =>
        acc + lesson.subLessons.filter((sub) => sub.completed).length,
      0,
    );
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getLessonProgress = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return { completed: 0, total: 0, isCompleted: false };

    const total = lesson.subLessons.length;
    const completed = lesson.subLessons.filter((sub) => sub.completed).length;
    const isCompleted = completed === total;

    return { completed, total, isCompleted };
  };

  const exportData = () => {
    // Include all exercise-specific data
    const exerciseData = {
      modelMatchUpData: localStorage.getItem("modelMatchUpData"),
      modelMatchUpTask2: localStorage.getItem("modelMatchUpTask2"),
      modelMatchUpTask3: localStorage.getItem("modelMatchUpTask3"),
      tokenPredictionState: localStorage.getItem("tokenPredictionState"),
    };

    return JSON.stringify(
      {
        lessons,
        exerciseData,
      },
      null,
      2,
    );
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);

      // Import lesson data
      if (parsed.lessons && Array.isArray(parsed.lessons)) {
        setLessons(parsed.lessons);
        saveCourseData(parsed.lessons);
      } else {
        throw new Error("Invalid data format");
      }

      // Import exercise-specific data
      if (parsed.exerciseData) {
        if (parsed.exerciseData.modelMatchUpData) {
          localStorage.setItem(
            "modelMatchUpData",
            parsed.exerciseData.modelMatchUpData,
          );
        }
        if (parsed.exerciseData.modelMatchUpTask2) {
          localStorage.setItem(
            "modelMatchUpTask2",
            parsed.exerciseData.modelMatchUpTask2,
          );
        }
        if (parsed.exerciseData.modelMatchUpTask3) {
          localStorage.setItem(
            "modelMatchUpTask3",
            parsed.exerciseData.modelMatchUpTask3,
          );
        }
        if (parsed.exerciseData.tokenPredictionState) {
          localStorage.setItem(
            "tokenPredictionState",
            parsed.exerciseData.tokenPredictionState,
          );
        }
      }
    } catch (error) {
      throw new Error("Failed to import data: Invalid JSON format");
    }
  };

  return (
    <CourseProgressContext.Provider
      value={{
        lessons,
        isLoading,
        updateSubLessonStatus,
        updateExerciseAnswer,
        updateFollowUpAnswer,
        updateStepAnswer,
        getOverallProgress,
        getLessonProgress,
        exportData,
        importData,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (context === undefined) {
    throw new Error(
      "useCourseProgress must be used within a CourseProgressProvider",
    );
  }
  return context;
}
