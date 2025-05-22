'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface EmployeeFormProps {
  initialData?: {
    id?: string
    employeeId: string
    name: string
    joiningDate: string
    basicSalary: number
  }
  action?: (formData: FormData) => Promise<{ success?: boolean; error?: string }>
  onSubmit?: (data: any) => Promise<void>
}

export function EmployeeForm({
  initialData,
  action,
  onSubmit,
}: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Format date to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        employeeId: formData.get('employeeId') as string,
        name: formData.get('name') as string,
        joiningDate: formData.get('joiningDate') as string,
        basicSalary: parseFloat(formData.get('basicSalary') as string),
      }

      console.log('Form data before submission:', data)

      if (!data.employeeId || !data.name || !data.joiningDate || isNaN(data.basicSalary)) {
        throw new Error('All fields are required')
      }

      // Create a new FormData object with the correct field names
      const newFormData = new FormData()
      if (initialData?.id) {
        newFormData.append('id', initialData.id)
      }
      newFormData.append('employeeId', data.employeeId)
      newFormData.append('name', data.name)
      newFormData.append('joiningDate', data.joiningDate)
      newFormData.append('basicSalary', data.basicSalary.toString())

      if (action) {
        console.log('Calling server action...')
        const result = await action(newFormData)
        console.log('Server action result:', result)

        if (result?.error) {
          throw new Error(result.error)
        }
        
        if (result?.success) {
          toast.success(initialData ? 'Employee updated successfully' : 'Employee created successfully')
          router.push('/dashboard/employees')
          router.refresh()
        } else {
          throw new Error('Failed to save employee')
        }
      } else if (onSubmit) {
        await onSubmit(data)
        toast.success(initialData ? 'Employee updated successfully' : 'Employee created successfully')
        router.push('/dashboard/employees')
        router.refresh()
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="employeeId" className="text-sm font-medium">
          Employee ID
        </label>
        <Input
          id="employeeId"
          name="employeeId"
          defaultValue={initialData?.employeeId}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={initialData?.name}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="joiningDate" className="text-sm font-medium">
          Joining Date
        </label>
        <Input
          id="joiningDate"
          name="joiningDate"
          type="date"
          defaultValue={initialData?.joiningDate ? formatDate(initialData.joiningDate) : new Date().toISOString().split('T')[0]}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="basicSalary" className="text-sm font-medium">
          Basic Salary
        </label>
        <Input
          id="basicSalary"
          name="basicSalary"
          type="number"
          step="0.01"
          defaultValue={initialData?.basicSalary || 0}
          disabled={isLoading}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Saving...' : initialData ? 'Update Employee' : 'Create Employee'}
      </Button>
    </form>
  )
} 