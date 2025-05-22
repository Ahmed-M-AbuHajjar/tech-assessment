'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Priority, Status } from '@prisma/client'

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(Status),
  assignedEmployeeIds: z.array(z.string()).optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  dueDate: z.string().optional(),
  startDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.dueDate) {
      return new Date(data.dueDate) >= new Date(data.startDate)
    }
    return true
  },
  {
    message: 'Due date cannot be before start date',
    path: ['dueDate'],
  }
)

export type TaskInput = z.infer<typeof taskSchema>

export async function createTask(data: TaskInput) {
  try {
    const validatedData = taskSchema.parse(data)
    const { startDate, dueDate, assignedEmployeeIds, ...rest } = validatedData
    const task = await db.task.create({
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedEmployees: {
          connect: assignedEmployeeIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        assignedEmployees: true,
      },
    })

    revalidatePath(`/dashboard/projects/${data.projectId}`)
    return { success: true, data: task }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to create task' }
  }
}

export async function updateTask(id: string, data: TaskInput) {
  try {
    const validatedData = taskSchema.parse(data)
    const { startDate, dueDate, assignedEmployeeIds, ...rest } = validatedData
    const task = await db.task.update({
      where: { id },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedEmployees: {
          set: assignedEmployeeIds?.map(id => ({ id })) || [],
        },
      },
      include: {
        assignedEmployees: true,
      },
    })

    revalidatePath(`/dashboard/projects/${data.projectId}`)
    return { success: true, data: task }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to update task' }
  }
}

export async function deleteTask(id: string) {
  try {
    const task = await db.task.findUnique({
      where: { id },
      select: { projectId: true },
    })

    if (!task) {
      return { success: false, error: 'Task not found' }
    }

    await db.task.delete({
      where: { id },
    })

    revalidatePath(`/dashboard/projects/${task.projectId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete task' }
  }
}

export async function getTasks(projectId: string) {
  try {
    const tasks = await db.task.findMany({
      where: { projectId },
      include: {
        assignedEmployees: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { success: true, data: tasks }
  } catch (error) {
    return { success: false, error: 'Failed to fetch tasks' }
  }
}

export async function getTask(id: string) {
  try {
    const task = await db.task.findUnique({
      where: { id },
      include: {
        assignedEmployees: true,
        project: true,
      },
    })

    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: 'Failed to fetch task' }
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const task = await db.task.update({
      where: { id: taskId },
      data: { status },
    })
    revalidatePath('/dashboard/projects')
    return { success: true, data: task }
  } catch (error) {
    return { success: false, error: 'Failed to update task status' }
  }
} 