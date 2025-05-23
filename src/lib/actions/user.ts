'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function getCurrentUserData() {
  try {
    const session = await auth()
    console.log('Session:', session)

    if (!session?.user?.id) {
      console.log('No session or user ID found')
      return null
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
      },
    })

    console.log('Found user:', user)
    return user
  } catch (error) {
    console.error('Error in getCurrentUserData:', error)
    return null
  }
}

export async function updateUserAvatar(userId: string, imageUrl: string) {
  return await db.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  })
}

export async function verifyEmail(token: string) {
  try {
    // Find user with this verification token
    const user = await db.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return { success: false, error: 'Invalid verification token' }
    }

    // Update user's email verification status
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Verification error:', error)
    return { success: false, error: 'Failed to verify email' }
  }
}

export async function updateUserToBlurrOrganization(userId: string) {
  try {
    console.log('Updating user organization:', userId)
    
    // Find the Blurr organization
    const blurrOrg = await db.organization.findFirst({
      where: { name: 'Blurr' }
    })

    if (!blurrOrg) {
      console.error('Blurr organization not found')
      return { success: false, error: 'Organization not found' }
    }

    console.log('Found Blurr organization:', blurrOrg.id)

    // Update the user's organization
    const user = await db.user.update({
      where: { id: userId },
      data: { organizationId: blurrOrg.id }
    })

    console.log('Updated user organization:', user.id, user.organizationId)
    
    return { success: true, data: user }
  } catch (error) {
    console.error('Error updating user organization:', error)
    return { success: false, error: 'Failed to update organization' }
  }
} 