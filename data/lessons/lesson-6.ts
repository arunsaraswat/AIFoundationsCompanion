import type { Lesson } from '../../../client/src/contexts/CourseProgressContext';

export const lesson6: Lesson = {
  id: 6,
  title: "The AI-Native Pitch",
  subLessons: [
    {
      id: "6.1",
      title: "From Learning to Leading",
      completed: false,
      exercises: [
        {
          id: "6.1.1",
          type: "textarea",
          label: "Class Discussion",
          description:
            "If your CEO or team leader asked, 'What did you actually learn this week?' What would you say first?",
          answer: "",
        },
        {
          id: "6.1.2",
          type: "textarea",
          label: "Journal",
          description:
            "Think of a time you failed to convince someone at work to try something new. What would you do differently now, knowing that the pitch must match the audience's specific pain points and motivations?",
          answer: "",
        },
      ],
    },
  ],
};