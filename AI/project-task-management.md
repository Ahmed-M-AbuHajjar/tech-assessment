# Project & Task Management Feature

## Purpose
Allow users to create, manage, and track projects and their associated tasks, including assignment and status tracking.

## Implementation
- Project and task CRUD server actions in `src/lib/actions/project.ts` and `src/lib/actions/task.ts`.
- Project list, form, and detail pages in `/dashboard/projects`.
- Task form, Kanban board, and backlog view for task management.
- Assignment of employees to tasks, with status and priority.
- Uses shadcn/ui components for UI consistency.

## Reasoning
- Central to project-based organizations and teams.
- Kanban and backlog views support different workflows (agile, waterfall, etc.).
- Extensible for future features (Gantt charts, notifications, dependencies). 