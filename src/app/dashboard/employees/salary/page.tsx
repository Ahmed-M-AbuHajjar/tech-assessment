import { getEmployees } from '@/lib/actions/employee'
import { getSalaries, updateSalaryWithMonth } from '@/lib/actions/salary'
import { SalaryTable } from '@/components/salary/SalaryTable'
import { MonthSelector } from '@/components/salary/MonthSelector'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AllSalariesPage({
  searchParams,
}: {
  searchParams: { month?: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const month = searchParams.month
    ? new Date(searchParams.month)
    : new Date()

  const [{ data: employees }, { data: salaries }] = await Promise.all([
    getEmployees(),
    getSalaries(month),
  ])

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Employees
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Salary Management</h1>
            <p className="text-gray-500 mt-1">Manage salaries for all employees</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MonthSelector currentMonth={month} />
        </div>
      </div>

      <SalaryTable
        employees={employees || []}
        salaries={salaries || []}
        onUpdateSalary={async (employeeId, basicSalary, data) => {
          'use server'
          await updateSalaryWithMonth(
            employeeId,
            month,
            basicSalary,
            data
          )
        }}
      />
    </div>
  )
} 