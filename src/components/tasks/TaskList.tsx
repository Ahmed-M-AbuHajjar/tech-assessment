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
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deleteTask } from '@/lib/actions/task'
import Link from 'next/link'

interface TaskListProps {
  tasks: (Task & {
    assignedTo: {
      id: string
      name: string
    } | null
  })[]
  projectId: string
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  REVIEW: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
}

export function TaskList({ tasks, projectId }: TaskListProps) {
  const router = useRouter()

  const handleDelete = async (taskId: string) => {
    try {
      const result = await deleteTask(taskId)
      if (result.success) {
        toast.success('Task deleted successfully')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to delete task')
      }
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/dashboard/projects/${projectId}/tasks/${task.id}`}
                  className="hover:underline"
                >
                  {task.title}
                </Link>
              </TableCell>
              <TableCell className="max-w-md truncate">
                {task.description || 'No description'}
              </TableCell>
              <TableCell>
                <Badge className={statusColors[task.status]}>
                  {task.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={priorityColors[task.priority]}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      router.push(`/dashboard/projects/${projectId}/tasks/${task.id}`)
                    }}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      router.push(`/dashboard/projects/${projectId}/tasks/${task.id}/edit`)
                    }}
                    title="Edit Task"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(task.id)
                    }}
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No tasks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 