# App Planner & PRD Manager - PRD Document

## Original Problem Statement
Build a modular app-planning system called "App Planner & PRD Manager" where ALL parts (planner sections, PRD sections, features, sub-features, rules, user flows, data models, notes) are fully ADDABLE, EDITABLE, DELETABLE, and REORDERABLE using a Block-based architecture.

## User Personas
- **Solo Developers**: Planning personal projects and side hustles
- **Product Managers**: Structuring PRDs and feature documentation
- **Startup Founders**: Mapping out MVP features and data models
- **Freelancers**: Documenting client project requirements

## Core Requirements (Static)
1. Block-based architecture for all content types
2. Status tracking (Not Started, In Progress, Blocked, Needs Review, Done, Deprecated)
3. Priority system (Must, Should, Nice, Optional)
4. Parent-child relationships with infinite nesting
5. Soft delete (Deprecated status) - never hard delete
6. Drag & drop reordering
7. Tree view and Table view
8. Progress tracking per app/section
9. LocalStorage persistence
10. Dark theme with black/gray/orange/blue color scheme

## What's Been Implemented (MVP - January 2026)
### Dashboard
- [x] App listing with progress cards
- [x] Create new app dialog
- [x] Delete app with confirmation
- [x] Empty state with CTA

### App Workspace
- [x] Header with app name, description, progress
- [x] Left sidebar with block tree navigation
- [x] Main canvas with Tree and Table views
- [x] Block editor panel (right sidebar)
- [x] Search blocks by title
- [x] Filter by status and type
- [x] View toggle (Tree/Table)

### Block Management
- [x] 10 block types supported
- [x] Add blocks (root or child)
- [x] Inline edit block title
- [x] Status dropdown per block
- [x] Priority dropdown per block
- [x] Expand/collapse nested blocks
- [x] Drag & drop reordering
- [x] Soft delete (Deprecate)

### Block Editor Panel
- [x] Edit title and description
- [x] Change type, status, priority
- [x] Add notes
- [x] View metadata (ID, timestamps)
- [x] Deprecate block action

### Data Persistence
- [x] LocalStorage for all data
- [x] Auto-save on changes
- [x] Progress calculation

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Keyboard shortcuts (Cmd+N for new block, etc.)
- [ ] Undo/Redo functionality
- [ ] Block search in sidebar

### P1 - High Priority
- [ ] Export to Markdown/JSON
- [ ] Import data backup
- [ ] Block templates (pre-defined structures)
- [ ] Blocked reason field for blocked status

### P2 - Medium Priority
- [ ] AI-powered block generation
- [ ] Multi-select blocks for bulk actions
- [ ] Color coding/tagging for blocks
- [ ] Progress dashboard with charts

### P3 - Nice to Have
- [ ] Real-time collaboration
- [ ] User authentication
- [ ] Cloud sync
- [ ] Mobile app

## Technical Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI
- **State**: LocalStorage with custom StorageManager utility
- **Drag & Drop**: @hello-pangea/dnd
- **Routing**: React Router DOM v7
- **No Backend**: All data stored client-side

## Next Action Items
1. Add keyboard shortcuts for power users
2. Implement undo/redo with history stack
3. Add export functionality (Markdown/JSON)
4. Consider AI integration for auto-generating PRD content
