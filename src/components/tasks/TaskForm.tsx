'use client'

import { TaskInput } from '@/lib/actions/task'
import { Employee } from '@prisma/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Priority, Status } from '@prisma/client'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  assignedEmployeeIds: z.array(z.string()).optional(),
  projectId: z.string(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
})

interface TaskFormProps {
  initialData?: {
    id?: string
    title: string
    description?: string | null
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
    assignedEmployeeIds?: string[]
    projectId: string
    startDate?: Date | null
    dueDate?: Date | null
  }
  onSubmit: (data: z.infer<typeof taskSchema>) => void
  projectId: string
  employees: Employee[]
}

export function TaskForm({ initialData, onSubmit, projectId, employees }: TaskFormProps) {
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || 'MEDIUM',
      status: initialData?.status || 'TODO',
      assignedEmployeeIds: initialData?.assignedEmployeeIds || [],
      projectId,
      startDate: initialData?.startDate
        ? typeof initialData.startDate === 'string'
          ? initialData.startDate.split('T')[0]
          : initialData.startDate instanceof Date
            ? initialData.startDate.toISOString().split('T')[0]
            : ''
        : '',
      dueDate: initialData?.dueDate
        ? typeof initialData.dueDate === 'string'
          ? initialData.dueDate.split('T')[0]
          : initialData.dueDate instanceof Date
            ? initialData.dueDate.toISOString().split('T')[0]
            : ''
        : '',
    },
  })

  const selectedEmployeeIds = form.watch('assignedEmployeeIds') || []

  const handleEmployeeSelect = (employeeId: string) => {
    const currentIds = form.getValues('assignedEmployeeIds') || []
    if (!currentIds.includes(employeeId)) {
      form.setValue('assignedEmployeeIds', [...currentIds, employeeId])
    }
  }

  const handleEmployeeRemove = (employeeId: string) => {
    const currentIds = form.getValues('assignedEmployeeIds') || []
    form.setValue(
      'assignedEmployeeIds',
      currentIds.filter((id) => id !== employeeId)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TODO">To Do</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="REVIEW">Review</SelectItem>
                        <SelectItem value="DONE">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="assignedEmployeeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Employees</FormLabel>
                  <div className="space-y-2">
                    <Select
                      onValueChange={handleEmployeeSelect}
                      value=""
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employees" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees
                          .filter((employee) => !selectedEmployeeIds.includes(employee.id))
                          .map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployeeIds.map((employeeId) => {
                        const employee = employees.find((e) => e.id === employeeId)
                        return (
                          <Badge
                            key={employeeId}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {employee?.name}
                            <button
                              type="button"
                              onClick={() => handleEmployeeRemove(employeeId)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Save Task</Button>
        </div>
      </form>
    </Form>
  )
} 