import { getEmployee, updateEmployee } from '@/lib/actions/employee'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

export async function updateEmployeeAction(formData: FormData) {
  'use server'
  
  try {
    const id = formData.get('id') as string
    if (!id) {
      return { error: 'Employee ID is required' }
    }

    // Get the existing employee to preserve their organizationId
    const existingEmployee = await getEmployee(id)
    if (!existingEmployee.success || !existingEmployee.data) {
      return { error: 'Employee not found' }
    }

    const data = {
      employeeId: formData.get('employeeId') as string,
      name: formData.get('name') as string,
      joiningDate: formData.get('joiningDate') as string,
      basicSalary: parseFloat(formData.get('basicSalary') as string),
      organizationId: existingEmployee.data.organizationId, // Use existing organizationId
    }

    // Validate required fields
    if (!data.employeeId || !data.name || !data.joiningDate || isNaN(data.basicSalary)) {
      return { error: 'All fields are required' }
    }

    console.log('Updating employee with data:', data)
    const result = await updateEmployee(id, data)
    console.log('Update result:', result)
    
    if (!result.success) {
      console.error('Update failed:', result.error)
      return { error: typeof result.error === 'string' ? result.error : 'Failed to update employee' }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in updateEmployeeAction:', error)
    return { error: error instanceof Error ? error.message : 'Failed to update employee' }
  }
}

export default async function EditEmployeePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const result = await getEmployee(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Employee</h1>
        <EmployeeForm
          initialData={result.data}
          action={updateEmployeeAction}
        />
      </div>
    </div>
  )
} 