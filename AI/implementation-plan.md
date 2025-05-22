# Blurr HR Portal Implementation Plan

## Current Codebase Analysis
- Next.js application with server actions
- NextAuth.js for authentication
- Prisma with SQLite database
- React + Tailwind + shadcn for UI
- Basic authentication flow already implemented

## Database Schema Extensions

### 1. Employee Model
```prisma
model Employee {
  id            String    @id @default(cuid())
  employeeId    String    @unique
  name          String
  joiningDate   DateTime
  basicSalary   Float
  organizationId String
  organization  Organization @relation(fields: [organizationId], references: [id])
  tasks         Task[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### 2. Organization Model
```prisma
model Organization {
  id        String     @id @default(cuid())
  name      String
  employees Employee[]
  projects  Project[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### 3. Project Model
```prisma
model Project {
  id          String    @id @default(cuid())
  name        String
  description String?
  tasks       Task[]
  organizationId String
  organization  Organization @relation(fields: [organizationId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

### 4. Task Model
```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  priority    Priority  @default(MEDIUM)
  status      Status    @default(TODO)
  assignedTo  Employee? @relation(fields: [assignedToId], references: [id])
  assignedToId String?
  project     Project   @relation(fields: [projectId], references: [id])
  projectId   String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum Status {
  TODO
  IN_PROGRESS
  REVIEW
  DONE
}
```

### 5. Salary Model
```prisma
model Salary {
  id          String    @id @default(cuid())
  employee    Employee  @relation(fields: [employeeId], references: [id])
  employeeId  String
  month       DateTime
  basicSalary Float
  bonus       Float     @default(0)
  deduction   Float     @default(0)
  totalAmount Float
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Implementation Phases

### Phase 1: Database and Authentication Setup
1. Update Prisma schema with new models
2. Create database migrations
3. Extend NextAuth to include organization context
4. Add organization selection/creation during registration

### Phase 2: Employee Management
1. Create employee management pages
   - Employee list view
   - Employee creation form
   - Employee details view
2. Implement employee CRUD operations using server actions
3. Add employee search and filtering

### Phase 3: Salary Management
1. Create salary management interface
   - Monthly salary table
   - Bonus/deduction input forms
2. Implement salary calculation logic
3. Add salary history view
4. Create salary report generation

### Phase 4: Project Management
1. Create project management interface
   - Project list view
   - Project creation form
   - Project details view
2. Implement project CRUD operations
3. Add project search and filtering

### Phase 5: Task Management
1. Create task management interface
   - Kanban board view
   - Task creation form
   - Task details view
2. Implement task CRUD operations
3. Add task assignment functionality
4. Create backlog view

### Phase 6: AI Chatbot Integration
1. Set up AI service integration
2. Create chat interface
3. Implement task and project information retrieval
4. Add natural language processing for queries

## Technical Implementation Details

### Server Actions Structure
```typescript
// Example server action structure
'use server'

export async function createEmployee(data: EmployeeInput) {
  // Implementation
}

export async function updateEmployee(id: string, data: EmployeeInput) {
  // Implementation
}

export async function deleteEmployee(id: string) {
  // Implementation
}
```

### Component Structure
```typescript
// Example component structure
components/
  employees/
    EmployeeList.tsx
    EmployeeForm.tsx
    EmployeeCard.tsx
  projects/
    ProjectList.tsx
    ProjectForm.tsx
    ProjectCard.tsx
  tasks/
    KanbanBoard.tsx
    TaskCard.tsx
    TaskForm.tsx
  salary/
    SalaryTable.tsx
    SalaryForm.tsx
  chat/
    ChatInterface.tsx
    MessageList.tsx
```

### API Routes Structure
```typescript
app/
  api/
    employees/
      route.ts
    projects/
      route.ts
    tasks/
      route.ts
    salary/
      route.ts
    chat/
      route.ts
```

## Next Steps
1. Begin with Phase 1 implementation
2. Create necessary database migrations
3. Set up basic employee management functionality
4. Implement salary calculation system
5. Add project and task management features
6. Integrate AI chatbot

## Notes
- Maintain existing UI components and styling
- Use shadcn components for consistency
- Implement proper error handling and loading states
- Add proper validation for all forms
- Ensure proper type safety throughout the application 