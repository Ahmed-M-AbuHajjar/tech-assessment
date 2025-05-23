import { getEmployees } from '@/lib/actions/employee'
import { EmployeeList } from '@/components/employees/EmployeeList'
import { Button } from '@/components/ui/button'
import { Plus, DollarSign } from 'lucide-react'
import { auth } from '@/lib/auth'
import { AddEmployeeButton } from '@/components/employees/AddEmployeeButton'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function EmployeesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const { data: employees } = await getEmployees()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Employees</h1>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees/salary">
            <Button variant="outline" className="gap-2">
              <DollarSign className="h-4 w-4" />
              View All Salaries
            </Button>
          </Link>
          <AddEmployeeButton />
        </div>
      </div>

      <EmployeeList
        employees={employees || []}
        onDelete={async (id) => {
          'use server'
          const { deleteEmployee } = await import('@/lib/actions/employee')
          await deleteEmployee(id)
        }}
      />
    </div>
  )
} 