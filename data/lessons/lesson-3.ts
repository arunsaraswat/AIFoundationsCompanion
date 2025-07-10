import type { Lesson } from '../../../client/src/contexts/CourseProgressContext';

export const lesson3: Lesson = {
  id: 3,
  title: "The AI-Native Operating Model",
  subLessons: [
    {
      id: "3.1",
      title: "3.1 The AI-Native Success Factors",
      completed: false,
      exercises: [
        {
          id: "discussion-10",
          type: "textarea",
          label: "How are we actually using AI?",
          description:
            'If someone asked your organization today, "How are we actually using AI?"—what would your answer be?',
          component: "ModelComparison",
        },
        {
          id: "exercise-19",
          type: "multi-step",
          label: "Personalizing the Playbook",
          description:
            "Multi-step activity to apply AI-Native Success Factors",
          steps: [
            {
              id: "pick-factor",
              type: "radio",
              label: "Pick a Success Factor",
              description:
                "Review the 7 AI-Native Success Factors. Which one feels most within your control to start living out in your day-to-day work?",
              options: [
                "Anchor AI to Business Value",
                "Upskill Relentlessly",
                "Move Fast, Learn Fast",
                "Start Smart: Include AI Early",
                "Tell the Full Story",
                "Embed AI into the Everyday",
                "Innovate Boldly, Govern Wisely",
              ],
              component: "ModelComparison",
            },
            {
              id: "define-application",
              type: "textarea",
              label: "Define How You'll Apply It",
              description:
                "What would it look like if you started modeling this success factor in how you work or lead right now?<br/>Examples: <ul><li> - Upskill Relentlessly → Block 1 hour/month for hands-on AI learning and share notes with team<li> - Tell the Full Story → Start adding use-case evidence to every AI recommendation <li> - Embed AI into the Everyday → Automate 1 report or feedback loop using a simple GenAI tool</ul>",
              component: "ModelComparison",
            },
            {
              id: "micro-plan",
              type: "multi-step",
              label: "Create a Micro-Plan",
              description:
                "What's your first move? Who needs to know? How will you track if it's working?",
              steps: [
                {
                  id: "action",
                  type: "text",
                  label: "Action (What I'll do)",
                  component: "ModelComparison",
                },
                {
                  id: "start-date",
                  type: "text",
                  label: "Start Date",
                  component: "ModelComparison",
                },
                {
                  id: "who-helps",
                  type: "text",
                  label: "Who It Helps",
                  component: "ModelComparison",
                },
                {
                  id: "success-looks",
                  type: "text",
                  label: "What Success Looks Like",
                  component: "ModelComparison",
                },
              ],
            },
            {
              id: "share-plan",
              type: "textarea",
              label: "Share Your Plan with your table",
              description: "Invite a few volunteers to share theirs",
              component: "ModelComparison",
            },
          ],
        },
        {
          id: "exercise-20",
          type: "textarea",
          label: "Journal",
          description:
            "Look back at the 7 AI-Native Success Factors and consider your current work environment. Which Success Factor feels like the biggest gap or opportunity in your organization right now? Write about why this particular factor stood out to you and what it would look like if your team or organization truly embodied this factor. What would change in how people work, make decisions, or approach challenges?",
          answer: "",
        },
      ],
    },
  ],
};