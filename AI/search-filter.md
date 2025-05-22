# Search & Filter Features

## Purpose
Enable users to quickly find projects and tasks by name, status, or assignee.

## Implementation
- Add search input to project list and backlog table.
- Filter results in-memory based on user input (case-insensitive).
- For large datasets, consider server-side filtering in the future.

## Reasoning
- Improves usability, especially for organizations with many projects/tasks.
- Simple to implement and performant for small/medium datasets.
- Can be extended to advanced filtering (by status, priority, etc.) as needed. 