# Salary Management Feature

## Purpose
Allow users to generate, view, and update employee salaries for any month, including bonuses and deductions.

## Implementation
- Salary CRUD server actions in `src/lib/actions/salary.ts`.
- Salary table and management page in `/dashboard/salary`.
- User can pick a month, add bonus/deduction, and see calculated total.
- Uses shadcn/ui components for UI consistency.

## Reasoning
- Essential for HR/payroll operations.
- Flexible for different salary structures and adjustments.
- Extensible for future features (salary history, reports, exports). 