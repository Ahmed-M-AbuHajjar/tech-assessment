# Development Guide

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- A Gmail account for email functionality

### Initial Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tech-assessment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NODEMAILER_USER="your-email@gmail.com"
   NODEMAILER_PASS="your-app-specific-password"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── verify-email/      # Email verification page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── employees/        # Employee management components
│   ├── projects/         # Project management components
│   ├── tasks/            # Task management components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── auth.ts           # Authentication utilities
│   ├── db.ts            # Database configuration
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
```

## Development Workflow

### 1. Creating New Features

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Implement your feature:
   - Add new components in `src/components`
   - Add new pages in `src/app`
   - Add new API routes in `src/app/api`
   - Add new server actions in `src/lib/actions`

3. Test your changes:
   - Test the UI
   - Test the API endpoints
   - Test the database operations

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

### 2. Database Changes

1. Modify the Prisma schema in `prisma/schema.prisma`

2. Create a migration:
   ```bash
   npx prisma migrate dev --name your-migration-name
   ```

3. Update the Prisma client:
   ```bash
   npx prisma generate
   ```

### 3. Adding New API Routes

1. Create a new route file in `src/app/api`

2. Implement the route handler:
   ```typescript
   import { NextResponse } from 'next/server'

   export async function GET(req: Request) {
     // Your implementation
   }

   export async function POST(req: Request) {
     // Your implementation
   }
   ```

### 4. Adding New Server Actions

1. Create a new action in `src/lib/actions`:
   ```typescript
   'use server'

   export async function yourAction() {
     // Your implementation
   }
   ```

2. Use the action in your components:
   ```typescript
   import { yourAction } from '@/lib/actions'

   // In your component
   const result = await yourAction()
   ```

## Best Practices

### Code Style

1. Use TypeScript for type safety
2. Follow the project's ESLint configuration
3. Use Prettier for code formatting
4. Write meaningful commit messages

### Component Development

1. Use server components by default
2. Use client components only when necessary
3. Keep components small and focused
4. Use proper prop typing
5. Implement error boundaries

### API Development

1. Validate input data
2. Handle errors properly
3. Return appropriate status codes
4. Document API endpoints
5. Implement rate limiting

### Database Operations

1. Use Prisma for all database operations
2. Implement proper error handling
3. Use transactions when necessary
4. Optimize queries
5. Add proper indexes

## Testing

### Unit Tests

1. Test components:
   ```typescript
   import { render, screen } from '@testing-library/react'
   import YourComponent from './YourComponent'

   describe('YourComponent', () => {
     it('renders correctly', () => {
       render(<YourComponent />)
       expect(screen.getByText('Expected Text')).toBeInTheDocument()
     })
   })
   ```

2. Test server actions:
   ```typescript
   import { yourAction } from '@/lib/actions'

   describe('yourAction', () => {
     it('performs the expected operation', async () => {
       const result = await yourAction()
       expect(result).toBeDefined()
     })
   })
   ```

### Integration Tests

1. Test API endpoints:
   ```typescript
   import { createMocks } from 'node-mocks-http'
   import handler from '@/app/api/your-endpoint/route'

   describe('API endpoint', () => {
     it('handles the request correctly', async () => {
       const { req, res } = createMocks({
         method: 'POST',
         body: { data: 'test' },
       })

       await handler(req, res)
       expect(res._getStatusCode()).toBe(200)
     })
   })
   ```

## Debugging

### Frontend Debugging

1. Use React Developer Tools
2. Use browser developer tools
3. Add console logs
4. Use error boundaries

### Backend Debugging

1. Use console logs
2. Check server logs
3. Use Prisma Studio:
   ```bash
   npx prisma studio
   ```

## Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Environment Variables

1. Set up production environment variables
2. Configure email service
3. Set up database connection

## Troubleshooting

### Common Issues

1. Database connection issues:
   - Check DATABASE_URL
   - Run migrations
   - Check Prisma client

2. Email sending issues:
   - Check NODEMAILER credentials
   - Verify Gmail settings
   - Check email templates

3. Authentication issues:
   - Check session configuration
   - Verify token handling
   - Check middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs) 