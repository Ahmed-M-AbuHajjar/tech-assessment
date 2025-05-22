import { getEmployee } from '@/lib/actions/employee'
import { getSalaries, updateSalaryWithMonth } from '@/lib/actions/salary'
import { SalaryTable } from '@/components/salary/SalaryTable'
import { MonthSelector } from '@/components/salary/MonthSelector'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function EmployeeSalaryPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { month?: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const month = searchParams.month
    ? new Date(searchParams.month)
    : new Date()

  const [{ data: employee }, { data: salaries }] = await Promise.all([
    getEmployee(params.id),
    getSalaries(month),
  ])

  if (!employee) {
    redirect('/dashboard/employees')
  }

  // Filter salaries for this employee only
  const employeeSalaries = salaries?.filter(s => s.employeeId === params.id) || []

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Salary Management</h1>
          <p className="text-gray-500 mt-1">Manage salary for {employee.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <MonthSelector currentMonth={month} />
        </div>
      </div>

      <SalaryTable
        employees={[employee]}
        salaries={employeeSalaries}
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