'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export type ProjectInput = z.infer<typeof projectSchema>

export async function createProject(data: ProjectInput) {
  try {
    const validatedData = projectSchema.parse(data)
    
    const project = await db.project.create({
      data: validatedData,
    })

    revalidatePath('/dashboard/projects')
    return { success: true, data: project }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to create project' }
  }
}

export async function updateProject(id: string, data: ProjectInput) {
  try {
    const validatedData = projectSchema.parse(data)
    
    const project = await db.project.update({
      where: { id },
      data: validatedData,
    })

    revalidatePath('/dashboard/projects')
    return { success: true, data: project }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to update project' }
  }
}

export async function deleteProject(id: string) {
  try {
    await db.project.delete({
      where: { id },
    })

    revalidatePath('/dashboard/projects')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete project' }
  }
}

export async function getProjects(organizationId: string | null | undefined) {
  try {
    if (!organizationId) {
      return { success: false, error: 'Organization ID is required' }
    }

    console.log('Fetching projects for organization:', organizationId)
    const projects = await db.project.findMany({
      where: { organizationId },
      include: {
        tasks: {
          include: {
            assignedEmployees: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('Found projects:', projects)
    return { success: true, data: projects }
  } catch (error) {
    console.error('Error fetching projects:', error)
    return { success: false, error: 'Failed to fetch projects' }
  }
}

export async function getProject(id: string) {
  try {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            assignedEmployees: true,
          },
        },
      },
    })

    return { success: true, data: project }
  } catch (error) {
    return { success: false, error: 'Failed to fetch project' }
  }
} 