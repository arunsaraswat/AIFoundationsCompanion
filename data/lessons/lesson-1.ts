import type { Lesson } from '../../../client/src/contexts/CourseProgressContext';

export const lesson1: Lesson = {
  id: 1,
  title: "EDGE & AI-Native",
  subLessons: [
    {
      id: "1.1",
      title: "1.1 Welcome & Orientation",
      completed: false,
      exercises: [
        {
          id: "1.1.1",
          type: "textarea",
          label: "What Kind of Change Are You Feeling?",
          description:
            'Go around table with introductions. Share: Name, role, location. Complete: "Ever since ChatGPT went viral, the world is..."',
          component: "ModelComparison",
        },
        {
          id: "1.1.2",
          type: "radio-with-text",
          label: "EDGE Reaction Line-Up",
          description:
            "Go stand by the sign that's had the biggest impact on their role or industry.",
          options: [
            "Exponential - Things are speeding up way faster than expected",
            "Disruptive - Our old ways of doing things are suddenly not working",
            "Generative - New tools are helping create things we used to do manually",
            "Emergent - Stuff is happening that we didn't plan for—and don't fully understand yet",
          ],
          component: "ModelComparison",
          followUpAnswer: "",
          followUpLabel: "Discussion Questions:",
          followUpDescription:
            '"Why did you pick this one?" "Where have you seen it in action?"',
        },
        {
          id: "1.1.3",
          type: "textarea",
          label: "Journal Entry",
          description:
            "Which of the four EDGE forces—Exponential, Disruptive, Generative, or Emergent—do you feel most personally in your current role? Write about a specific example from your work where you've experienced this force, and describe what it means for how you need to think or act differently going forward.",
          component: "ModelComparison",
        },
      ],
    },
    {
      id: "1.2",
      title: "1.2 Introduction to AI-Native",
      completed: false,
      exercises: [
        {
          id: "1.2.1",
          type: "textarea",
          label: "What Comes to Mind?",
          description:
            'Pair discussion about "AI-Native" phrase. First thoughts and feelings. No wrong answers',
          component: "ModelComparison",
        },
        {
          id: "1.2.2",
          type: "textarea",
          label: "What AI-Native Means to Me",
          description:
            'Each person answers: "What does it look like to relentlessly embed AI in my work?" "What\'s one example of how my organization could structurally bake in AI?"',
          component: "ModelComparison",
        },
        {
          id: "1.2.4",
          type: "textarea",
          label: "Journal: AI-First Mindset",
          description:
            'Think about a task you completed yesterday. Write about how your approach might change if you automatically asked "How can AI help with this?" before starting. What would shift in your process, timeline, or outcomes?',
          component: "ModelComparison",
        },
      ],
    },
  ],
};