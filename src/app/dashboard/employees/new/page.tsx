import { createEmployee } from '@/lib/actions/employee'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createEmployeeAction(formData: FormData) {
  'use server'
  try {
    const session = await auth()
    if (!session?.user?.organizationId) {
      return { error: 'No organization found. Please join or create an organization first.' }
    }
    const data = {
      employeeId: formData.get('employeeId') as string,
      name: formData.get('name') as string,
      joiningDate: formData.get('joiningDate') as string,
      basicSalary: parseFloat(formData.get('basicSalary') as string),
      organizationId: session.user.organizationId,
    }
    console.log('Received form data:', data)
    if (!data.employeeId || !data.name || !data.joiningDate || isNaN(data.basicSalary) || !data.organizationId) {
      console.error('Validation failed:', { data })
      return { error: 'Missing required fields' }
    }
    const employeeData = { ...data }
    console.log('Sending to createEmployee:', employeeData)
    const result = await createEmployee(employeeData)
    console.log('createEmployee result:', result)
    if (!result.success) {
      console.error('Failed to create employee:', result.error)
      if (Array.isArray(result.error)) {
        return { error: result.error.map(e => e.message).join(', ') }
      }
      return { error: typeof result.error === 'string' ? result.error : 'Failed to create employee' }
    }
    return { success: true }
  } catch (error) {
    console.error('Error in createEmployeeAction:', error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: 'Failed to create employee' }
  }
}

export default async function NewEmployeePage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Employee</h1>
        <EmployeeForm action={createEmployeeAction} />
      </div>
    </div>
  )
} 