# Employee Management Feature

## Purpose
Allow users to add, edit, view, and delete employees in their organization.

## Implementation
- Employee CRUD server actions in `src/lib/actions/employee.ts`.
- Employee list, form, and detail pages in `/dashboard/employees`.
- Uses shadcn/ui components for consistent UI.
- Validates input with Zod and react-hook-form.

## Reasoning
- Core HR functionality for any organization.
- Extensible for future features (e.g., employee roles, departments).
- Follows best practices for type safety and validation. 