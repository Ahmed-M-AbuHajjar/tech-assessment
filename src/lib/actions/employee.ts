'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const employeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  name: z.string().min(1, 'Name is required'),
  joiningDate: z.string().transform((str) => new Date(str)),
  basicSalary: z.number().min(0, 'Basic salary must be positive'),
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export type EmployeeInput = z.infer<typeof employeeSchema>

export async function createEmployee(data: EmployeeInput) {
  try {
    console.log('Validating data:', data)
    const validatedData = employeeSchema.parse(data)
    console.log('Validated data:', validatedData)
    
    console.log('Creating employee in database...')
    const employee = await db.employee.create({
      data: validatedData,
    })
    console.log('Employee created:', employee)

    revalidatePath('/dashboard/employees')
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error in createEmployee:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to create employee' }
  }
}

export async function updateEmployee(id: string, data: EmployeeInput) {
  try {
    console.log('Validating update data:', data)
    const validatedData = employeeSchema.parse(data)
    console.log('Validated update data:', validatedData)
    
    console.log('Updating employee in database...')
    const employee = await db.employee.update({
      where: { id },
      data: validatedData,
    })
    console.log('Employee updated:', employee)

    revalidatePath('/dashboard/employees')
    return { success: true, data: employee }
  } catch (error) {
    console.error('Error in updateEmployee:', error)
    
    // Handle Prisma unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint failed')) {
      if (error.message.includes('employeeId')) {
        return { success: false, error: 'An employee with this ID already exists' }
      }
    }
    
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map(e => e.message).join(', ') }
    }
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: 'Failed to update employee' }
  }
}

export async function deleteEmployee(id: string) {
  try {
    await db.employee.delete({
      where: { id },
    })

    revalidatePath('/dashboard/employees')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete employee' }
  }
}

export async function getEmployee(id: string) {
  try {
    const employee = await db.employee.findUnique({
      where: { id },
    })

    return { success: true, data: employee }
  } catch (error) {
    return { success: false, error: 'Failed to fetch employee' }
  }
}

export async function getEmployees() {
  try {
    const employees = await db.employee.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: employees }
  } catch (error) {
    return { success: false, error: 'Failed to fetch employees' }
  }
} 