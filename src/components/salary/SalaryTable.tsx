'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Employee {
  id: string
  name: string
  basicSalary: number
}

interface Salary {
  id: string
  employeeId: string
  basicSalary: number
  bonus: number
  deduction: number
  totalAmount: number
  month: Date
}

interface SalaryTableProps {
  employees: Employee[]
  salaries: Salary[]
  onUpdateSalary: (employeeId: string, basicSalary: number, data: { bonus: number; deduction: number }) => Promise<void>
}

export function SalaryTable({ employees, salaries, onUpdateSalary }: SalaryTableProps) {
  const router = useRouter()
  const [salaryRecords, setSalaryRecords] = useState<Record<string, Salary>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialize salary records from props
  useEffect(() => {
    const initialRecords: Record<string, Salary> = {}
    employees.forEach(emp => {
      const existingSalary = salaries.find(s => s.employeeId === emp.id)
      initialRecords[emp.id] = existingSalary || {
        id: '',
        employeeId: emp.id,
        basicSalary: emp.basicSalary,
        bonus: 0,
        deduction: 0,
        totalAmount: emp.basicSalary,
        month: new Date()
      }
    })
    setSalaryRecords(initialRecords)
  }, [employees, salaries])

  // Handle bonus/deduction changes
  const handleAmountChange = (employeeId: string, type: 'bonus' | 'deduction', value: string) => {
    const amount = parseFloat(value) || 0
    const employee = employees.find(emp => emp.id === employeeId)
    if (!employee) return

    setSalaryRecords(prev => {
      const record = prev[employeeId]
      const newBonus = type === 'bonus' ? amount : record.bonus
      const newDeduction = type === 'deduction' ? amount : record.deduction
      const newTotal = employee.basicSalary + newBonus - newDeduction

      return {
        ...prev,
        [employeeId]: {
          ...record,
          [type]: amount,
          totalAmount: newTotal
        }
      }
    })
  }

  // Save salary records
  const handleSave = async () => {
    setIsLoading(true)
    try {
      for (const [employeeId, record] of Object.entries(salaryRecords)) {
        await onUpdateSalary(employeeId, record.basicSalary, {
          bonus: record.bonus,
          deduction: record.deduction
        })
      }
      toast.success('Salary changes saved successfully')
      router.refresh()
    } catch (error) {
      console.error('Error saving salary records:', error)
      toast.error('Failed to save salary changes')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Bonus</TableHead>
              <TableHead>Deduction</TableHead>
              <TableHead>Total Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => {
              const record = salaryRecords[employee.id]
              return (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>${employee.basicSalary.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={record?.bonus || 0}
                      onChange={(e) => handleAmountChange(employee.id, 'bonus', e.target.value)}
                      className="w-32"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={record?.deduction || 0}
                      onChange={(e) => handleAmountChange(employee.id, 'deduction', e.target.value)}
                      className="w-32"
                      min="0"
                      step="0.01"
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>${record?.totalAmount.toFixed(2) || employee.basicSalary.toFixed(2)}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 