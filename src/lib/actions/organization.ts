'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getOrCreateBlurrOrganization() {
  console.log('Checking for Blurr organization...')
  const blurrOrg = await db.organization.findFirst({
    where: { name: 'Blurr' },
  })

  if (blurrOrg) {
    console.log('Found existing Blurr organization:', blurrOrg.id)
    return { success: true, data: blurrOrg }
  }

  console.log('Creating new Blurr organization...')
  const newOrg = await db.organization.create({
    data: { name: 'Blurr' },
  })
  console.log('Created new Blurr organization:', newOrg.id)
  revalidatePath('/dashboard')
  return { success: true, data: newOrg }
}

export async function getOrganizations() {
  try {
    const organizations = await db.organization.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, data: organizations };
  } catch (error) {
    return { success: false, error: 'Failed to fetch organizations' };
  }
} 