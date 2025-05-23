'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, DollarSign } from 'lucide-react'

interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  joiningDate: Date
  basicSalary: number
}

interface EmployeeTableProps {
  employees: Employee[]
  onDelete: (id: string) => Promise<void>
}

export function EmployeeTable({ employees, onDelete }: EmployeeTableProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await onDelete(id)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>
                {new Date(employee.joiningDate).toLocaleDateString()}
              </TableCell>
              <TableCell>${employee.basicSalary.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/employees/${employee.id}/salary`)}
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/employees/${employee.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(employee.id)}
                    disabled={isDeleting === employee.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 