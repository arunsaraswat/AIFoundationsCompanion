export interface UseCase {
  id: string;
  title: string;
  correctCategory: 'AI' | 'ML' | 'DL';
  rationale: string;
  inputPlaceholder: string;
  outputPlaceholder: string;
  userCategory?: string;
  userInput?: string;
  userOutput?: string;
}

export const useCases: UseCase[] = [
  {
    id: "netflix",
    title: "Netflix Recommendations",
    correctCategory: "ML",
    rationale: "Uses machine learning algorithms to analyze viewing patterns and suggest content based on user behavior and preferences.",
    inputPlaceholder: "user viewing history, ratings, demographic data",
    outputPlaceholder: "personalized movie/show recommendations"
  },
  {
    id: "facial-recognition",
    title: "Facial Recognition on Smartphones",
    correctCategory: "DL",
    rationale: "Deep learning neural networks process facial features through multiple layers to identify and authenticate users.",
    inputPlaceholder: "camera images, facial landmarks",
    outputPlaceholder: "user identity verification, unlock decision"
  },
  {
    id: "chatgpt",
    title: "ChatGPT / LLMs",
    correctCategory: "DL",
    rationale: "Large Language Models use deep neural networks with transformer architecture to understand and generate human-like text.",
    inputPlaceholder: "text prompts, conversation context",
    outputPlaceholder: "coherent text responses, answers"
  },
  {
    id: "google-translate",
    title: "Google Translate",
    correctCategory: "DL",
    rationale: "Neural machine translation uses deep learning to understand context and meaning across languages.",
    inputPlaceholder: "text in source language",
    outputPlaceholder: "translated text in target language"
  },
  {
    id: "autonomous-vehicles",
    title: "Autonomous Vehicles",
    correctCategory: "AI",
    rationale: "Combines multiple AI techniques including computer vision, sensor fusion, and decision-making algorithms.",
    inputPlaceholder: "camera feeds, sensor data, GPS, maps",
    outputPlaceholder: "driving decisions, steering, braking commands"
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection in Banking",
    correctCategory: "ML",
    rationale: "Machine learning models analyze transaction patterns to identify anomalies and potential fraudulent activity.",
    inputPlaceholder: "transaction data, account history, user patterns",
    outputPlaceholder: "fraud risk score, alert notifications"
  },
  {
    id: "ai-art",
    title: "AI-generated Art (DALL·E)",
    correctCategory: "DL",
    rationale: "Deep generative models create images from text descriptions using sophisticated neural network architectures.",
    inputPlaceholder: "text descriptions, style prompts",
    outputPlaceholder: "generated images, artwork"
  },
  {
    id: "voice-assistants",
    title: "Smart Home Voice Assistants",
    correctCategory: "AI",
    rationale: "Integrates speech recognition, natural language processing, and smart home control systems.",
    inputPlaceholder: "voice commands, ambient audio",
    outputPlaceholder: "device actions, spoken responses"
  },
  {
    id: "medical-imaging",
    title: "Medical Imaging Diagnostics",
    correctCategory: "DL",
    rationale: "Deep learning models analyze medical images to detect patterns and abnormalities for diagnostic assistance.",
    inputPlaceholder: "X-rays, MRI scans, CT images",
    outputPlaceholder: "diagnostic insights, anomaly detection"
  },
  {
    id: "live-captions",
    title: "Real-time Language Captioning",
    correctCategory: "DL",
    rationale: "Deep learning processes audio streams in real-time to convert speech to text with high accuracy.",
    inputPlaceholder: "live audio streams, speech signals",
    outputPlaceholder: "real-time text captions"
  }
];

export const categories = [
  {
    id: 'AI',
    title: 'Artificial Intelligence (AI)',
    description: 'Broad field simulating human intelligence'
  },
  {
    id: 'ML',
    title: 'Machine Learning (ML)',
    description: 'Systems that learn from data'
  },
  {
    id: 'DL',
    title: 'Deep Learning (DL)',
    description: 'Neural networks with multiple layers'
  }
] as const;