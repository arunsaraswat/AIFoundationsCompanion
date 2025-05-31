import { createContext, useContext, useEffect, useState } from "react";
import { loadCourseData, saveCourseData } from "../utils/storage";

export interface SubLesson {
  id: string;
  title: string;
  completed: boolean;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox';
  label: string;
  description?: string;
  options?: string[];
  answer?: string | string[];
}

export interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

interface CourseProgressContextType {
  lessons: Lesson[];
  updateSubLessonStatus: (lessonId: number, subLessonId: string, completed: boolean) => void;
  updateExerciseAnswer: (lessonId: number, subLessonId: string, exerciseId: string, answer: string | string[]) => void;
  getOverallProgress: () => { completed: number; total: number; percentage: number };
  getLessonProgress: (lessonId: number) => { completed: number; total: number; isCompleted: boolean };
  exportData: () => string;
  importData: (data: string) => void;
}

const CourseProgressContext = createContext<CourseProgressContextType | undefined>(undefined);

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "EDGE+ AI-Native Foundations",
    subLessons: [
      { 
        id: "1.1", 
        title: "Welcome & Orientation", 
        completed: false,
        exercises: [
          {
            id: "1.1.1",
            type: "textarea",
            label: "Fast Pass - \"What Kind of Change Are You Feeling?\"",
            description: "Go around table with introductions. Share: Name, role, location. Complete: \"Ever since ChatGPT went viral, the world is...\" Optional prompts for EDGE forces",
            answer: ""
          },
          {
            id: "1.1.2",
            type: "radio",
            label: "Exercise 1: EDGE Reaction Line-Up",
            description: "Go stand by the sign that's had the biggest impact on their role or industry. In your group, discuss: \"Why did you pick this one?\" \"Where have you seen it in action?\"",
            options: [
              "Exponential - Things are speeding up way faster than expected",
              "Disruptive - Our old ways of doing things are suddenly not working",
              "Generative - New tools are helping create things we used to do manually",
              "Emergent - Stuff is happening that we didn't plan for—and don't fully understand yet"
            ],
            answer: ""
          },
          {
            id: "1.1.3",
            type: "textarea",
            label: "Exercise 2: Looking Ahead",
            description: "Individual reflection: \"One question I hope this course answers...\" Write down or share in chat",
            answer: ""
          }
        ]
      },
      { 
        id: "1.2", 
        title: "Introduction to AI-Native", 
        completed: false,
        exercises: [
          {
            id: "1.2.1",
            type: "textarea",
            label: "Discussion 2: What Comes to Mind?",
            description: "Pair discussion about \"AI-Native\" phrase. First thoughts and feelings. No wrong answers",
            answer: ""
          },
          {
            id: "1.2.2",
            type: "textarea",
            label: "Exercise 3: What AI-Native Means to Me - Step 1: Individual Reflection",
            description: "Each person answers: \"What does it look like to relentlessly embed AI in my work?\" \"What's one example of how my org could structurally bake in AI?\" Write 1 sticky note per definition (Professional & Org) for your domain.",
            answer: ""
          },
          {
            id: "1.2.3",
            type: "textarea",
            label: "Exercise 3: What AI-Native Means to Me - Step 2: Find the Patterns",
            description: "In your group, affinity group your organizational sticky notes and identify and share patterns you see across your organizations.",
            answer: ""
          },
          {
            id: "1.2.4",
            type: "text",
            label: "Exercise 4: One Word Check-In",
            description: "Write one word about AI-Native feelings. Hold up sticky note. 2-3 volunteers share reasoning",
            answer: ""
          }
        ]
      },
    ],
  },
  {
    id: 2,
    title: "AI Technical Foundations",
    subLessons: [
      { id: "2.1", title: "AI Basics", completed: false },
      { id: "2.2", title: "Data", completed: false },
      { id: "2.3", title: "LLMs – The Mind Behind the Curtain", completed: false },
      { id: "2.4", title: "Prompting + Safe Use", completed: false },
      { id: "2.5", title: "RAG", completed: false },
      { id: "2.6", title: "Agentic Workflow Primer", completed: false },
      { id: "2.7", title: "Frontiers in AI", completed: false },
    ],
  },
  {
    id: 3,
    title: "The AI-Native Operating Model",
    subLessons: [
      { id: "3.1", title: "The AI-Native Operating Model — A Playbook for Getting Real Value from AI", completed: false },
    ],
  },
  {
    id: 4,
    title: "Workflow Redesign + Implementation",
    subLessons: [
      { id: "4.1", title: "Workflow Baseline Lab & Redesign with AI Step", completed: false },
      { id: "4.2", title: "Operate & Reinforce", completed: false },
      { id: "4.3", title: "Document & Share", completed: false },
    ],
  },
  {
    id: 5,
    title: "Opportunity Assessment + Roadmapping",
    subLessons: [
      { id: "5.1", title: "AI Opportunity Jumpstart", completed: false },
      { id: "5.2", title: "30-60-90 Roadmap", completed: false },
    ],
  },
  {
    id: 6,
    title: "Advocacy + Influence",
    subLessons: [
      { id: "6.1", title: "Pitch Crafting", completed: false },
      { id: "6.2", title: "Pitch Rehearsal + Marketplace", completed: false },
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

  const updateExerciseAnswer = (lessonId: number, subLessonId: string, exerciseId: string, answer: string | string[]) => {
    setLessons(prev =>
      prev.map(lesson =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map(subLesson =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map(exercise =>
                        exercise.id === exerciseId
                          ? { ...exercise, answer }
                          : exercise
                      )
                    }
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
        updateExerciseAnswer,
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
