# Commit History

This file tracks key features and changes delivered in each commit to the AI Native Foundations Class Companion project.

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

*Note: This commit history file was created on 2025-07-10. Previous commits may be added retroactively for historical context.*