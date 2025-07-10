# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **AI Native Foundations Class Companion** - a React-based educational platform that provides interactive learning experiences for AI and machine learning courses. The application serves as a comprehensive learning companion with 6 structured lessons covering AI foundations, prompt engineering, workflows, and implementation strategies.

## Development Commands

### Core Development
- `npm run dev` - Start development server with hot reload (runs on port 5000)
- `npm run build` - Build production application
- `npm start` - Run production server
- `npm run check` - Run TypeScript type checking

### Database Management
- `npm run db:push` - Push database schema changes using Drizzle

### Testing
There are no specific test scripts configured. Check if tests exist in the codebase before assuming testing frameworks.

## Architecture Overview

### Full-Stack Structure
- **Frontend**: React 18 + TypeScript + Vite in `client/` directory
- **Backend**: Express.js server in `server/` directory
- **Shared**: Common schemas and types in `shared/` directory
- **Database**: Drizzle ORM with PostgreSQL support (Neon Database)

### Key Architectural Patterns
- **Monorepo Structure**: Client and server code in same repository
- **Type-Safe Development**: TypeScript throughout with shared schemas
- **Context-Driven State**: React Context for course progress and theme management
- **Local-First Data**: Progress stored in localStorage with import/export capability
- **Component-Based UI**: Radix UI primitives with shadcn/ui components

### Frontend Architecture
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API + localStorage persistence
- **UI Components**: Radix UI primitives + shadcn/ui + Tailwind CSS
- **Data Fetching**: TanStack Query for server state management
- **Styling**: Tailwind CSS with CSS-in-JS support

### Backend Architecture
- **API Design**: REST endpoints with `/api` prefix
- **AI Integration**: OpenRouter and OpenAI Assistant endpoints
- **Database**: Drizzle ORM with PostgreSQL schema
- **Static Serving**: Express static file serving in production

## Key Components & Features

### Interactive Learning Components
- **TokenPrediction**: Simulates language model token prediction
- **ModelComparison**: Side-by-side AI model testing interface
- **WorkflowDiagramEditor**: Visual workflow creation with ReactFlow
- **PromptAnatomy**: Structured prompt building interface
- **RagStep1/RagStep2**: Retrieval-augmented generation exercises

### Core Application Components
- **CourseProgressContext**: Manages lesson completion and exercise answers
- **ThemeContext**: Light/dark theme management
- **Layout**: Main application shell with sidebar navigation
- **LessonAccordion**: Expandable lesson content structure

### Data Management
- **Local Storage**: All progress data persisted locally
- **Import/Export**: JSON-based data portability
- **Course Schema**: Comprehensive lesson/exercise data structure

## Course Structure

The application contains 6 main lessons:
1. **EDGE & AI-Native** - Introduction and orientation
2. **AI Technical Foundations** - Core AI concepts, models, prompting
3. **The AI-Native Operating Model** - Success factors and implementation
4. **Workflow Redesign + Implementation** - Process improvement and business cases
5. **Roadmap to AI-Native** - 30-60-90 day planning
6. **The AI-Native Pitch** - Leadership and influence

## Environment Configuration

### Required Environment Variables
- `DATABASE_URL` - Neon PostgreSQL database URL
- `OPENROUTER_KEY` - OpenRouter API key for AI model access
- `OPENAI_API_KEY` - OpenAI API key for Assistant functionality

### Development Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start development server: `npm run dev`
4. Application runs on `http://localhost:5000`

## File Structure Conventions

### Path Aliases
- `@/` - Points to `client/src/`
- `@shared/` - Points to `shared/`
- `@assets/` - Points to `attached_assets/`

### Component Organization
- `client/src/components/` - Reusable UI components
- `client/src/components/ui/` - shadcn/ui primitive components
- `client/src/pages/` - Route-specific page components
- `client/src/contexts/` - React Context providers
- `client/src/hooks/` - Custom React hooks

## AI Integration

### OpenRouter Integration
- Model: `openai/gpt-4o-mini`
- Endpoints: `/api/openrouter-completion`, `/api/ai/query`, `/api/ai/chat`
- Used for general AI completions and model comparisons

### OpenAI Assistant Integration
- Endpoint: `/api/openai-assistant`
- Used for specialized RAG functionality with document processing
- Supports file citations and annotations

## Important Notes

### Development Practices
- Always run `npm run check` before commits to ensure type safety
- Use existing component patterns and styling conventions
- Follow the established context patterns for state management
- Maintain the local-first data approach with localStorage

### Git Commit Workflow
- **IMPORTANT**: After every successful commit and push, update `commit-history.md` with:
  - Commit hash and date
  - Brief description of changes
  - Key features delivered (3-5 bullet points)
  - Any breaking changes or migration notes
- Use conventional commit format: `feat:`, `fix:`, `refactor:`, `docs:`, etc.
- Include detailed commit messages with context and reasoning
- Always append the Claude Code signature to commit messages

### Data Persistence
- All course progress stored in localStorage
- Exercise-specific data (ModelMatchUp, TokenPrediction) have separate storage keys
- Import/export functionality preserves all user data

### UI/UX Patterns
- Responsive design with mobile-first approach
- Accessible navigation with ARIA labels
- Consistent theming with light/dark mode support
- Progressive disclosure in lesson content