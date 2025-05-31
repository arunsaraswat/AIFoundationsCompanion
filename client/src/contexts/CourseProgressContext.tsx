import { createContext, useContext, useEffect, useState } from "react";
import { loadCourseData, saveCourseData } from "../utils/storage";

export interface SubLesson {
  id: string;
  title: string;
  completed: boolean;
}

export interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

interface CourseProgressContextType {
  lessons: Lesson[];
  updateSubLessonStatus: (lessonId: number, subLessonId: string, completed: boolean) => void;
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  getLessonProgress: (lessonId: number) => { completed: number; total: number; isCompleted: boolean };
  exportData: () => string;
  importData: (data: string) => void;
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "Introduction to AI Fundamentals",
    subLessons: [
      { id: "1.1", title: "What is Artificial Intelligence?", completed: false },
      { id: "1.2", title: "History and Evolution of AI", completed: false },
      { id: "1.3", title: "Types of AI Systems", completed: false },
    ],
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    subLessons: [
      { id: "2.1", title: "Supervised Learning", completed: false },
      { id: "2.2", title: "Unsupervised Learning", completed: false },
      { id: "2.3", title: "Reinforcement Learning", completed: false },
    ],
  },
  {
    id: 3,
    title: "Neural Networks",
    subLessons: [
      { id: "3.1", title: "Perceptrons and Multi-layer Networks", completed: false },
      { id: "3.2", title: "Activation Functions", completed: false },
      { id: "3.3", title: "Backpropagation", completed: false },
    ],
  },
  {
    id: 4,
    title: "Deep Learning",
    subLessons: [
      { id: "4.1", title: "Convolutional Neural Networks", completed: false },
      { id: "4.2", title: "Recurrent Neural Networks", completed: false },
      { id: "4.3", title: "Transfer Learning", completed: false },
    ],
  },
  {
    id: 5,
    title: "Natural Language Processing",
    subLessons: [
      { id: "5.1", title: "Text Preprocessing and Tokenization", completed: false },
      { id: "5.2", title: "Word Embeddings", completed: false },
      { id: "5.3", title: "Transformer Models", completed: false },
    ],
  },
  {
    id: 6,
    title: "AI Ethics and Future",
    subLessons: [
      { id: "6.1", title: "Bias and Fairness in AI", completed: false },
      { id: "6.2", title: "Privacy and Security", completed: false },
      { id: "6.3", title: "Future of AI Technology", completed: false },
    ],
  },
];

export function CourseProgressProvider({ children }: { children: React.ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = loadCourseData();
    return saved || initialLessons;
  });

  useEffect(() => {
    saveCourseData(lessons);
  }, [lessons]);

  const updateSubLessonStatus = (lessonId: number, subLessonId: string, completed: boolean) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map(subLesson =>
                subLesson.id === subLessonId
                  ? { ...subLesson, completed }
                  : subLesson
              ),
            }
          : lesson
      )
    );
  };

  const getOverallProgress = () => {
    const total = lessons.reduce((acc, lesson) => acc + lesson.subLessons.length, 0);
    const completed = lessons.reduce(
      (acc, lesson) => acc + lesson.subLessons.filter(sub => sub.completed).length,
      0
    );
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getLessonProgress = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson) return { completed: 0, total: 0, isCompleted: false };
    
    const total = lesson.subLessons.length;
    const completed = lesson.subLessons.filter(sub => sub.completed).length;
    const isCompleted = completed === total;
    
    return { completed, total, isCompleted };
  };

  const exportData = () => {
    return JSON.stringify({ lessons }, null, 2);
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.lessons && Array.isArray(parsed.lessons)) {
        setLessons(parsed.lessons);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      throw new Error("Failed to import data: Invalid JSON format");
    }
  };

  return (
    <CourseProgressContext.Provider
      value={{
        lessons,
        updateSubLessonStatus,
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
    throw new Error("useCourseProgress must be used within a CourseProgressProvider");
  }
  return context;
}
