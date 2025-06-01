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
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'multi-step' | 'radio-with-text' | 'component' | 'link';
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
  updateSubLessonStatus: (lessonId: number, subLessonId: string, completed: boolean) => void;
  updateExerciseAnswer: (lessonId: number, subLessonId: string, exerciseId: string, answer: string | string[]) => void;
  updateFollowUpAnswer: (lessonId: number, subLessonId: string, exerciseId: string, answer: string) => void;
  updateStepAnswer: (lessonId: number, subLessonId: string, exerciseId: string, stepId: string, answer: string) => void;
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
        title: "1.1 Welcome & Orientation", 
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
            type: "radio-with-text",
            label: "Exercise 1: EDGE Reaction Line-Up",
            description: "Go stand by the sign that's had the biggest impact on their role or industry.",
            options: [
              "Exponential - Things are speeding up way faster than expected",
              "Disruptive - Our old ways of doing things are suddenly not working",
              "Generative - New tools are helping create things we used to do manually",
              "Emergent - Stuff is happening that we didn't plan for—and don't fully understand yet"
            ],
            answer: "",
            followUpAnswer: "",
            followUpLabel: "Discussion Questions:",
            followUpDescription: "\"Why did you pick this one?\" \"Where have you seen it in action?\""
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
        title: "1.2 Introduction to AI-Native", 
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
            type: "multi-step",
            label: "Exercise 3: What AI-Native Means to Me",
            description: "Multi-step activity: Translate the Definition (Individual then Affinity Group)",
            steps: [
              {
                id: "1.2.2.1",
                type: "textarea",
                label: "Step 1: Individual Reflection",
                description: "Each person answers: \"What does it look like to relentlessly embed AI in my work?\" \"What's one example of how my org could structurally bake in AI?\" Write 1 sticky note per definition (Professional & Org) for your domain.",
                answer: ""
              },
              {
                id: "1.2.2.2", 
                type: "textarea",
                label: "Step 2: Find the Patterns",
                description: "In your group, affinity group your organizational sticky notes and identify and share patterns you see across your organizations.",
                answer: ""
              }
            ],
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
      { 
        id: "2.1", 
        title: "2.1 AI Basics", 
        completed: false,
        exercises: [
          {
            id: "2.1.1",
            type: "textarea",
            label: "Discussion 3: \"Explain It to Someone's Grandparent\"",
            description: "Pair up and explain AI, ML, DL to each other. Take 1-2 minutes each person. Make it simple and clear. Flag confusing or technical terms.",
            answer: ""
          },
          {
            id: "2.1.2",
            type: "link",
            label: "Exercise 5: \"Model Match-Up\" (AI Basics)",
            description: "Interactive card-based exercise to sort real-world use cases into AI/ML/DL categories and define their inputs/outputs.",
            link: "/exercise/model-match-up",
            answer: ""
          },
          {
            id: "2.1.3",
            type: "radio-with-text",
            label: "Exercise 6: \"What Changed Your Mind?\" (AI Basics)",
            description: "Reflect on what you would explain differently about AI concepts after the exercises.",
            options: [
              "I would explain AI concepts much more simply",
              "I would focus more on real-world examples",
              "I would emphasize the differences between AI/ML/DL more clearly",
              "I would address common misconceptions first",
              "I wouldn't change my approach much"
            ],
            answer: "",
            followUpAnswer: "",
            followUpLabel: "Table Synthesis:",
            followUpDescription: "What collective insight would you share about explaining AI concepts?"
          }
        ]
      },
      { 
        id: "2.2", 
        title: "2.2 Data", 
        completed: false,
        exercises: [
          {
            id: "discussion-4",
            type: "textarea",
            label: "Discussion 4: \"Data as a Design Decision\"",
            description: "Scenario: Global music playlist generator. Discuss impact of English-only data. Consider age demographic limitations."
          },
          {
            id: "exercise-7",
            type: "component",
            label: "Exercise 7: \"Bad Data Risk Assessment\"",
            description: "Task 3: Mark any 'bad data' risk point on the card (e.g., skewed inputs, noisy training data, missing labels). Facilitator circulates, prompting questions: 'Would this still work if it had half the data?' 'What assumptions is this model making about the user or context?'",
            component: "ModelMatchUp"
          },
          {
            id: "exercise-8",
            type: "textarea",
            label: "Exercise 8: \"Where Bad Data Hurts Most\"",
            description: "Individual reflection on your work. Identify 2-3 high-impact bad data areas. Record answers in workbook."
          }
        ]
      },
      { id: "2.3", title: "2.3 LLMs – The Mind Behind the Curtain", completed: false },
      { id: "2.4", title: "2.4 Prompting + Safe Use", completed: false },
      { id: "2.5", title: "2.5 RAG", completed: false },
      { id: "2.6", title: "2.6 Agentic Workflow Primer", completed: false },
      { id: "2.7", title: "2.7 Frontiers in AI", completed: false },
    ],
  },
  {
    id: 3,
    title: "The AI-Native Operating Model",
    subLessons: [
      { id: "3.1", title: "3.1 The AI-Native Operating Model — A Playbook for Getting Real Value from AI", completed: false },
    ],
  },
  {
    id: 4,
    title: "Workflow Redesign + Implementation",
    subLessons: [
      { id: "4.1", title: "4.1 Workflow Baseline Lab & Redesign with AI Step", completed: false },
      { id: "4.2", title: "4.2 Operate & Reinforce", completed: false },
      { id: "4.3", title: "4.3 Document & Share", completed: false },
    ],
  },
  {
    id: 5,
    title: "Opportunity Assessment + Roadmapping",
    subLessons: [
      { id: "5.1", title: "5.1 AI Opportunity Jumpstart", completed: false },
      { id: "5.2", title: "5.2 30-60-90 Roadmap", completed: false },
    ],
  },
  {
    id: 6,
    title: "Advocacy + Influence",
    subLessons: [
      { id: "6.1", title: "6.1 Pitch Crafting", completed: false },
      { id: "6.2", title: "6.2 Pitch Rehearsal + Marketplace", completed: false },
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

  const updateFollowUpAnswer = (lessonId: number, subLessonId: string, exerciseId: string, answer: string) => {
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
                          ? { ...exercise, followUpAnswer: answer }
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

  const updateStepAnswer = (lessonId: number, subLessonId: string, exerciseId: string, stepId: string, answer: string) => {
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
                          ? {
                              ...exercise,
                              steps: exercise.steps?.map(step =>
                                step.id === stepId
                                  ? { ...step, answer }
                                  : step
                              )
                            }
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
    // Include all exercise-specific data
    const exerciseData = {
      modelMatchUpData: localStorage.getItem("modelMatchUpData"),
      modelMatchUpTask2: localStorage.getItem("modelMatchUpTask2"),
      modelMatchUpTask3: localStorage.getItem("modelMatchUpTask3")
    };
    
    return JSON.stringify({ 
      lessons, 
      exerciseData 
    }, null, 2);
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
          localStorage.setItem("modelMatchUpData", parsed.exerciseData.modelMatchUpData);
        }
        if (parsed.exerciseData.modelMatchUpTask2) {
          localStorage.setItem("modelMatchUpTask2", parsed.exerciseData.modelMatchUpTask2);
        }
        if (parsed.exerciseData.modelMatchUpTask3) {
          localStorage.setItem("modelMatchUpTask3", parsed.exerciseData.modelMatchUpTask3);
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
    throw new Error("useCourseProgress must be used within a CourseProgressProvider");
  }
  return context;
}
