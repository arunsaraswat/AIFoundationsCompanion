# AI Native Foundations - Class Companion

## Overview

This is a React-based educational application called "AI Native Foundations - Class Companion" that serves as an interactive learning platform for an AI course. The application features a comprehensive progress tracking system, interactive exercises, and AI-powered learning tools. It's designed as a single-page application with client-side state management using localStorage, with minimal server-side functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API with localStorage persistence
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Server**: Express.js with minimal API endpoints
- **Runtime**: Node.js with ES modules
- **Development**: Hot module replacement via Vite middleware
- **Production**: Static file serving with API proxy

## Key Components

### 1. Course Progress System
- **CourseProgressContext**: Centralized state management for lesson completion tracking
- **Lessons Structure**: 6 lessons with 3 sub-lessons each, containing interactive exercises
- **Progress Tracking**: Real-time progress calculation and visual progress bars
- **Data Persistence**: All progress stored in localStorage with import/export functionality

### 2. Interactive Exercises
- **Multi-format Support**: Text inputs, textareas, radio buttons, checkboxes, multi-step workflows
- **Specialized Components**: 
  - TokenPrediction: AI token prediction simulation
  - PromptAnatomy: Structured prompt building
  - ModelComparison: Side-by-side AI model testing
  - AgentDesign: Multi-step agent workflow design
  - WorkflowDiagramEditor: Visual workflow creation with ReactFlow

### 3. AI Integration
- **OpenRouter API**: Integration for AI completions using GPT-4o-mini
- **OpenAI Assistant**: Dedicated assistant for specialized tasks
- **RAG Testing**: Retrieval-augmented generation testing with document sources

### 4. User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme System**: Light/dark mode toggle with persistent preferences
- **Navigation**: Collapsible sidebar with lesson navigation and utility functions
- **Accessibility**: ARIA labels and keyboard navigation support

## Data Flow

### 1. State Management Flow
```
User Interaction → Context Update → localStorage Persistence → UI Re-render
```

### 2. Exercise Completion Flow
```
Exercise Form → Validation → State Update → Progress Calculation → Visual Feedback
```

### 3. AI Integration Flow
```
User Input → API Request → Response Processing → State Storage → UI Display
```

### 4. Data Export/Import Flow
```
Export: Context State → JSON Serialization → File Download
Import: File Upload → JSON Parsing → State Validation → Context Update
```

## External Dependencies

### Core Dependencies
- **React Ecosystem**: react, react-dom, @types/react
- **Routing**: wouter for lightweight routing
- **Styling**: tailwindcss, autoprefixer, postcss
- **UI Components**: @radix-ui/* components, class-variance-authority
- **State Management**: @tanstack/react-query for server state
- **Form Handling**: @hookform/resolvers, react-hook-form
- **Utilities**: clsx, date-fns, nanoid

### Development Dependencies
- **Build Tools**: vite, @vitejs/plugin-react, esbuild
- **TypeScript**: typescript, @types/node
- **Database**: drizzle-orm, drizzle-kit, @neondatabase/serverless
- **Development**: tsx for TypeScript execution

### External Services
- **OpenRouter**: AI completion API for multiple model access
- **OpenAI**: Assistant API for specialized RAG functionality
- **Neon Database**: PostgreSQL database (configured but not actively used)

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **TypeScript**: Real-time type checking and compilation
- **Environment Variables**: DATABASE_URL, OPENROUTER_KEY for API access

### Production Build
- **Frontend**: Vite build generates optimized static assets
- **Backend**: esbuild bundles server code for Node.js execution
- **Deployment**: Express server serves static files and API endpoints
- **Database**: Drizzle ORM configured for PostgreSQL (Neon)

### Build Process
1. `npm run build`: Compiles frontend and backend
2. Static assets output to `dist/public`
3. Server bundle output to `dist/index.js`
4. `npm start`: Runs production server

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 02, 2025. Initial setup