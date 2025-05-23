import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcryptjs'
import { getOrCreateBlurrOrganization } from '@/lib/actions/organization'

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // Get or create Blurr organization
    const orgResult = await getOrCreateBlurrOrganization()
    if (!orgResult.success) {
      throw new Error('Failed to get organization')
    }

    // Create user
    const hashedPassword = await hash(password, 12)
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        organizationId: orgResult.data.id,
      },
    })

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        organizationId: user.organizationId,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    )
  }
} 