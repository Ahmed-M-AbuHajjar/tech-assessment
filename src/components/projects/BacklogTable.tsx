'use client'

import { Task } from '@prisma/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteTask } from '@/lib/actions/task'

interface BacklogTableProps {
  tasks: Task[]
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-yellow-100 text-yellow-800',
  DONE: 'bg-green-100 text-green-800',
}

export function BacklogTable({ tasks }: BacklogTableProps) {
  const [viewTask, setViewTask] = useState<Task | null>(null)
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteTask(id)
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell className="max-w-md truncate">
                {task.description}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusColors[task.status as keyof typeof statusColors]}
                >
                  {task.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {task.startDate
                  ? format(new Date(task.startDate), 'MMM d, yyyy')
                  : 'No start date'}
              </TableCell>
              <TableCell>
                {task.dueDate
                  ? format(new Date(task.dueDate), 'MMM d, yyyy')
                  : 'No due date'}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    task.priority === 'HIGH'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }
                >
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewTask(task)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/dashboard/projects/${task.projectId}/tasks/${task.id}/edit`)}
                    title="Edit Task"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingId === task.id}
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Modal for viewing task details */}
      {viewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Task Details</h2>
            <div className="mb-2"><b>Title:</b> {viewTask.title}</div>
            <div className="mb-2"><b>Description:</b> {viewTask.description || 'No description'}</div>
            <div className="mb-2"><b>Status:</b> {viewTask.status}</div>
            <div className="mb-2"><b>Priority:</b> {viewTask.priority}</div>
            <div className="mb-2"><b>Start Date:</b> {viewTask.startDate ? format(new Date(viewTask.startDate), 'PPP') : 'No start date'}</div>
            <div className="mb-2"><b>Due Date:</b> {viewTask.dueDate ? format(new Date(viewTask.dueDate), 'PPP') : 'No due date'}</div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setViewTask(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 