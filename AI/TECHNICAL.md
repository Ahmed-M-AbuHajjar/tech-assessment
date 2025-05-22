# Technical Documentation

## Architecture Overview

### Frontend Architecture
- **App Router**: Next.js 14's App Router for routing and server components
- **Server Components**: Used for data fetching and server-side rendering
- **Client Components**: Used for interactive UI elements
- **State Management**: React hooks and server actions
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI with Tailwind CSS

### Backend Architecture
- **API Routes**: Next.js API routes for external API endpoints
- **Server Actions**: For form submissions and data mutations
- **Database**: SQLite with Prisma ORM
- **Email Service**: Nodemailer with Gmail SMTP

## Authentication Flow

1. **Registration**:
   - User submits email and password
   - Password is hashed using bcrypt
   - Verification token is generated
   - Verification email is sent
   - User is redirected to verification page

2. **Email Verification**:
   - User clicks verification link
   - Token is validated
   - User's email is marked as verified
   - User is redirected to dashboard

3. **Login**:
   - User submits credentials
   - Credentials are validated
   - Session is created
   - User is redirected to dashboard

## Database Models

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  password      String?
  image         String?
  verificationToken String? @unique
  organization  Organization? @relation(fields: [organizationId], references: [id])
  organizationId String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Organization Model
```prisma
model Organization {
  id        String     @id @default(cuid())
  name      String
  users     User[]
  employees Employee[]
  projects  Project[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Employee Model
```prisma
model Employee {
  id            String    @id @default(cuid())
  employeeId    String    @unique
  name          String
  joiningDate   DateTime
  basicSalary   Float
  organizationId String
  organization  Organization @relation(fields: [organizationId], references: [id])
  assignedTasks Task[] @relation("EmployeeAssignedTasks")
  salaries      Salary[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/reset-password` - Password reset

### User Management
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user profile
- `PUT /api/user/avatar` - Update user avatar

### Organization Management
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `PUT /api/organizations/:id` - Update organization

### Employee Management
- `GET /api/employees` - List employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Project Management
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Management
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Salary Management
- `GET /api/salaries` - List salaries
- `POST /api/salaries` - Create salary record
- `PUT /api/salaries/:id` - Update salary record

## Security Measures

### Password Security
- Passwords are hashed using bcrypt
- Password reset tokens are time-limited
- Password complexity requirements

### API Security
- Protected routes using middleware
- Input validation using Zod
- Rate limiting on authentication endpoints
- CORS configuration

### Data Security
- SQL injection prevention through Prisma
- XSS prevention through React
- CSRF protection
- Secure session management

## Email System

### Email Templates
- Verification email
- Password reset email
- Welcome email

### Email Configuration
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
})
```

## Error Handling

### Frontend Error Handling
- Form validation errors
- API error responses
- Network errors
- Toast notifications for user feedback

### Backend Error Handling
- Input validation
- Database errors
- Email sending errors
- Authentication errors

## Performance Optimization

### Frontend
- Server components for reduced client-side JavaScript
- Image optimization
- Code splitting
- Lazy loading

### Backend
- Database indexing
- Query optimization
- Caching strategies
- Rate limiting

## Testing Strategy

### Unit Tests
- Component testing
- Utility function testing
- API endpoint testing

### Integration Tests
- Authentication flow
- Data flow
- API integration

### E2E Tests
- User journeys
- Critical paths
- Edge cases

## Deployment

### Requirements
- Node.js 18+
- SQLite database
- Gmail SMTP access
- Environment variables

### Environment Variables
```env
DATABASE_URL="file:./dev.db"
NODEMAILER_USER="your-email@gmail.com"
NODEMAILER_PASS="your-app-specific-password"
```

### Build Process
1. Install dependencies
2. Run database migrations
3. Build the application
4. Start the server

## Monitoring and Logging

### Application Logs
- Error logging
- Authentication attempts
- API requests
- Performance metrics

### Error Tracking
- Error boundaries
- Error reporting
- Performance monitoring

## Future Improvements

### Planned Features
- Real-time notifications
- Advanced reporting
- Mobile application
- API documentation
- Automated testing
- CI/CD pipeline 