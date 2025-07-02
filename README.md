# AI Native Foundations - Class Companion

An advanced AI-powered interactive learning platform that revolutionizes technical education through dynamic, personalized exercises and adaptive learning technologies. This React-based educational application serves as a comprehensive learning companion for AI and machine learning courses.

## 🚀 Features

### Interactive Learning Components
- **Token Prediction Simulator** - Hands-on experience with AI token generation
- **Prompt Anatomy Builder** - Structured approach to crafting effective prompts
- **Model Comparison Tool** - Side-by-side testing of different AI models
- **Agent Workflow Designer** - Visual workflow creation with multi-step processes
- **RAG Testing Framework** - Retrieval-augmented generation with document sources

### Course Management
- **Progress Tracking** - Real-time completion tracking across 6 comprehensive lessons
- **Interactive Exercises** - Multiple format support (text, radio, checkboxes, multi-step)
- **Data Persistence** - All progress stored locally with import/export functionality
- **Adaptive Learning** - Personalized learning paths based on completion status

### Modern UI/UX
- **Responsive Design** - Mobile-first approach with adaptive layouts
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Accessible Navigation** - ARIA labels and keyboard navigation support
- **Professional Components** - Built with Radix UI primitives and Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** with shadcn/ui component library for modern styling
- **Wouter** for lightweight client-side routing
- **React Context API** with localStorage persistence for state management
- **TanStack Query** for server state management

### Backend
- **Express.js** with minimal API endpoints
- **Node.js** with ES modules
- **Drizzle ORM** with PostgreSQL support (Neon Database)
- **OpenAI/OpenRouter** integration for AI completions

### UI Components
- **Radix UI** primitives for accessible components
- **Framer Motion** for smooth animations
- **ReactFlow** for interactive workflow diagrams
- **Recharts** for data visualization
- **Lucide React** for consistent iconography

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-native-foundations
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url
   OPENROUTER_KEY=your_openrouter_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── main.tsx       # Application entry point
├── server/                # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── package.json           # Project dependencies
```

## 🎯 Core Learning Modules

### Lesson 1: AI Technical Foundations
- Understanding AI model architectures
- Token prediction and generation
- Model comparison and evaluation

### Lesson 2: Prompt Engineering
- Anatomy of effective prompts
- Transformation techniques
- Quick decision-making prompts

### Lesson 3: Advanced AI Applications
- Retrieval-Augmented Generation (RAG)
- Document processing and sourcing
- Context-aware responses

### Lesson 4: Agent Design Patterns
- Multi-agent system architecture
- Workflow orchestration
- Scaling considerations

### Lesson 5: Practical Implementation
- Real-world application development
- Performance optimization
- Integration strategies

### Lesson 6: Advanced Topics
- Cutting-edge AI techniques
- Research methodologies
- Future directions

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production-ready application
- `npm start` - Run production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🌐 API Integration

### OpenRouter Integration
The application integrates with OpenRouter for access to multiple AI models:
- GPT-4o-mini for general completions
- Model comparison capabilities
- Flexible API switching

### OpenAI Assistant
Dedicated OpenAI Assistant integration for:
- Specialized RAG functionality
- Document processing
- Advanced reasoning tasks

## 💾 Data Management

### Local Storage
- Progress tracking persisted locally
- Import/export functionality for data portability
- No server-side user data storage by default

### Database Support
- Drizzle ORM configured for PostgreSQL
- Neon Database integration ready
- Scalable schema design

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Configuration
- Frontend built to `dist/public`
- Backend bundled to `dist/index.js`
- Static file serving with API proxy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 External Services

- **OpenRouter** - Multi-model AI API access
- **OpenAI** - Assistant API for specialized tasks
- **Neon Database** - Serverless PostgreSQL hosting

## 🆘 Support

For support and questions:
1. Check the documentation in the `replit.md` file
2. Review the component implementations in the `client/src/components` directory
3. Examine the API routes in `server/routes.ts`

## 🏗️ Architecture Overview

The application follows a modern full-stack architecture:

- **Frontend-Heavy Design** - Most logic handled client-side
- **Minimal Backend** - Express server for API proxy and static serving
- **Type-Safe Development** - TypeScript throughout the stack
- **Component-Based UI** - Modular, reusable React components
- **Context-Driven State** - Centralized state management with React Context
- **Progressive Enhancement** - Works offline with local storage

---

Built with ❤️ using React, TypeScript, and modern web technologies.