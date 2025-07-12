# Commit History

This file tracks key features and changes delivered in each commit to the AI Native Foundations Class Companion project.

## 2025-07-12

### Commit: 3a3ab6f - feat: Redesign Business Case tab with compact two-column layout and learning focus

**Key Features Delivered:**
- ✅ **Compact Two-Column Layout**: Redesigned Business Case component with efficient space usage and smaller headers
- ✅ **Learning-Focused Messaging**: Shifted from cost analysis to capability building and quick win positioning
- ✅ **Enhanced Visualizations**: New learning progression charts showing AI capability building path over time
- ✅ **Professional PDF Export**: Added jsPDF library for proper PDF generation with formatted business case content
- ✅ **Email Draft Modal**: Replaced email client launch with in-app modal displaying formatted email draft

**Breaking Changes:**
- Business Case interface updated with new fields for learning-focused content structure

**Migration Notes:**
- New jsPDF dependency added for PDF export functionality
- Business case data structure expanded to include learning and capability building fields

## 2025-07-10

### Commit: 2191ade - feat: Enhance sub-lesson navigation to preserve user state

**Key Features Delivered:**
- ✅ **URL-based Sub-lesson State Management**: Added `/lesson/:id/:subLessonId?` URL structure for direct sub-lesson access
- ✅ **Smart Exercise Navigation**: Exercise links now carry lesson context and return users to specific sub-lessons
- ✅ **Enhanced "Back to Lesson" Functionality**: All exercise pages now intelligently navigate back to the correct sub-lesson
- ✅ **Improved User Experience**: Users no longer lose their place when navigating between lessons, sub-lessons, and exercises
- ✅ **Backward Compatibility**: All existing URLs and navigation patterns continue to work seamlessly

**Technical Changes:**
- Updated routing architecture in App.tsx to support optional sub-lesson parameters
- Enhanced LessonPage.tsx with auto-expand functionality based on URL parameters
- Modified all exercise pages (ModelMatchUp, AgentDesign, WorkflowEnhancer) to accept lesson context
- Updated Sidebar.tsx navigation highlighting to work with new URL structure
- Maintained graceful fallback for legacy exercise links

**Impact:** Solves the navigation state loss issue where users would return to the main lesson page instead of their specific sub-lesson after completing exercises.

---

### Commit: 3142893 - feat: Add PDF viewing for Lesson 2 and fix OpenRouter API integration

**Key Features Delivered:**
- ✅ **PDF Viewing Capability**: Added PDF viewer component for lesson content viewing
- ✅ **OpenRouter API Integration**: Fixed and enhanced OpenRouter API for AI model interactions
- ✅ **Lesson 2 Content Access**: Integrated PDF content viewing specifically for AI Technical Foundations lesson
- ✅ **Modal-based PDF Display**: Clean, modal-based interface for viewing lesson materials
- ✅ **Static File Serving**: Improved static file serving architecture for PDF assets

**Impact:** Enhanced learning experience with direct access to lesson materials and improved AI integration for interactive exercises.

---

## 2025-07-11

### Commit: ff4bda2 - fix: Standardize PDF viewing to use modal instead of new tabs

**Key Features Delivered:**
- ✅ **Unified PDF Viewing Experience**: All PDFs now open in the same modal viewer component
- ✅ **Fixed Venue Network Handbook**: Resolved issue where handbook was opening in new tab instead of modal
- ✅ **Reusable PDFLink Component**: Created centralized component for consistent PDF handling
- ✅ **Eliminated Double Popups**: Fixed issue where clicking lesson PDFs showed multiple popups
- ✅ **Smart Link Detection**: Automatically detects PDF files and routes them to modal viewer

**Technical Changes:**
- Created new PDFLink.tsx component that wraps all PDF viewing logic
- Updated ExerciseForm.tsx to use PDFLink for all PDF references
- Replaced all `target="_blank"` PDF behaviors with modal viewer
- Maintained external non-PDF links opening in new tabs
- Fixed TypeScript errors in PDFViewerButton component

**Impact:** Provides a consistent, professional PDF viewing experience within the application without spawning multiple browser tabs or confusing popup behaviors.

---

### Commit: 1e405f0 - feat: Add PDF viewer support for Lesson 3

**Key Features Delivered:**
- ✅ **Lesson 3 PDF Integration**: Added PDF viewing capability for "The AI-Native Operating Model" lesson
- ✅ **Consistent UI Pattern**: Extended existing PDF viewer button pattern to include lesson 3
- ✅ **Asset Management**: Added lesson3.pdf to public/assets directory following established conventions
- ✅ **Seamless User Experience**: Users can now access lesson 3 content directly within the application

**Technical Changes:**
- Added lesson3.pdf file to public/assets directory
- Updated LessonPage.tsx conditional rendering to include lesson.id === 3
- Maintained existing PDF viewer modal functionality
- No breaking changes to existing functionality

**Impact:** Completes PDF content availability for the first three lessons, providing consistent access to course materials directly within the learning platform.

---

*Note: This commit history file was created on 2025-07-10. Previous commits may be added retroactively for historical context.*