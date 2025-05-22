import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      organizationId: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    organizationId: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    organizationId: string
  }
} 