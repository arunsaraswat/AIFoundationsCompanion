// Exercise type definitions
export const EXERCISE_TYPES = [
  "text",
  "textarea", 
  "date",
  "radio",
  "select",
  "checkbox",
  "multi-step",
  "radio-with-text",
  "component",
  "link"
] as const;

export type ExerciseType = typeof EXERCISE_TYPES[number];