'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const salarySchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  month: z.string().transform((str) => new Date(str)),
  basicSalary: z.number().min(0, 'Basic salary must be positive'),
  bonus: z.number().min(0, 'Bonus must be positive').default(0),
  deduction: z.number().min(0, 'Deduction must be positive').default(0),
})

export type SalaryInput = z.infer<typeof salarySchema>

export async function createSalary(data: SalaryInput) {
  try {
    const validatedData = salarySchema.parse(data)
    const totalAmount = validatedData.basicSalary + validatedData.bonus - validatedData.deduction

    const salary = await db.salary.create({
      data: {
        ...validatedData,
        totalAmount,
      },
    })

    revalidatePath('/dashboard/salary')
    return { success: true, data: salary }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to create salary record' }
  }
}

export async function updateSalaryWithMonth(
  employeeId: string,
  month: Date,
  basicSalary: number,
  data: { bonus: number; deduction: number }
) {
  try {
    // First, check if a salary record exists for this employee and month
    const existingSalary = await db.salary.findFirst({
      where: {
        employeeId,
        month: {
          gte: new Date(month.getFullYear(), month.getMonth(), 1),
          lte: new Date(month.getFullYear(), month.getMonth() + 1, 0),
        },
      },
    })

    const validatedData = salarySchema.parse({
      employeeId,
      month: month.toISOString(),
      basicSalary,
      bonus: data.bonus,
      deduction: data.deduction,
    })

    const totalAmount = validatedData.basicSalary + validatedData.bonus - validatedData.deduction

    if (existingSalary) {
      // Update existing record
      const salary = await db.salary.update({
        where: { id: existingSalary.id },
        data: {
          ...validatedData,
          totalAmount,
        },
      })
      revalidatePath('/dashboard/salary')
      return { success: true, data: salary }
    } else {
      // Create new record
      const salary = await db.salary.create({
        data: {
          ...validatedData,
          totalAmount,
        },
      })
      revalidatePath('/dashboard/salary')
      return { success: true, data: salary }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to update salary record' }
  }
}

export async function updateSalary(id: string, data: SalaryInput) {
  try {
    const validatedData = salarySchema.parse(data)
    const totalAmount = validatedData.basicSalary + validatedData.bonus - validatedData.deduction

    const salary = await db.salary.update({
      where: { id },
      data: {
        ...validatedData,
        totalAmount,
      },
    })

    revalidatePath('/dashboard/salary')
    return { success: true, data: salary }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors }
    }
    return { success: false, error: 'Failed to update salary record' }
  }
}

export async function getSalaries(month: Date) {
  try {
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const salaries = await db.salary.findMany({
      where: {
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        employee: true,
      },
      orderBy: {
        employee: {
          name: 'asc',
        },
      },
    })

    return { success: true, data: salaries }
  } catch (error) {
    return { success: false, error: 'Failed to fetch salary records' }
  }
}

export async function getSalary(id: string) {
  try {
    const salary = await db.salary.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    })

    return { success: true, data: salary }
  } catch (error) {
    return { success: false, error: 'Failed to fetch salary record' }
  }
} 