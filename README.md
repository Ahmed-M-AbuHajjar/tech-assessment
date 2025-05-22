# Blurr HR Portal

A comprehensive HR management system built with Next.js 14, Prisma, and Tailwind CSS.

## Features

### Authentication & User Management
- Email-based authentication
- Email verification system
- Password management
- User profile management with avatar upload
- Organization-based user management

### Employee Management
- Employee profiles with unique IDs
- Joining date tracking
- Basic salary management
- Organization assignment

### Project Management
- Project creation and tracking
- Task management with priorities and statuses
- Employee task assignment
- Project progress monitoring

### Task Management
- Task creation and assignment
- Priority levels (LOW, MEDIUM, HIGH)
- Status tracking (TODO, IN_PROGRESS, REVIEW, DONE)
- Due date management
- Multiple employee assignment per task

### Salary Management
- Monthly salary tracking
- Basic salary management
- Bonus and deduction tracking
- Total amount calculation
- Historical salary records

### Organization Management
- Multiple organization support
- Organization-specific employees
- Organization-specific projects
- User organization assignment

## Technical Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Shadcn UI Components
- React Hook Form
- Zod Validation
- Sonner Toast Notifications

### Backend
- Next.js API Routes
- Prisma ORM
- SQLite Database
- Nodemailer for email services

### Authentication
- Custom email-based authentication
- Email verification system
- Secure password hashing

## Database Schema

### User
- Basic user information
- Email verification
- Organization association
- Profile image

### Organization
- Organization details
- User associations
- Employee associations
- Project associations

### Employee
- Employee details
- Organization association
- Task assignments
- Salary records

### Project
- Project details
- Organization association
- Task associations

### Task
- Task details
- Priority levels
- Status tracking
- Employee assignments
- Project association

### Salary
- Monthly salary records
- Basic salary
- Bonuses
- Deductions
- Total calculations

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL="file:./dev.db"
   NODEMAILER_USER="your-email@gmail.com"
   NODEMAILER_PASS="your-app-specific-password"
   ```
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Email Configuration

The application uses Gmail SMTP for sending emails. To set up:

1. Enable 2-factor authentication in your Gmail account
2. Generate an App Password
3. Use the App Password in your NODEMAILER_PASS environment variable

## Security Features

- Email verification for new accounts
- Secure password hashing
- Protected API routes
- Organization-based access control
- Input validation using Zod

## Development Guidelines

### Code Structure
- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations

### Best Practices
- Use server actions for data mutations
- Implement proper error handling
- Follow TypeScript best practices
- Maintain consistent code formatting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
