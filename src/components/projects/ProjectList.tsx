'use client'

import { Project, Task } from '@prisma/client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProjectListProps {
  projects: (Project & {
    tasks: (Task & {
      assignedEmployees: {
        name: string
      }[]
    })[]
  })[]
  onDelete: (id: string) => Promise<void>
}

export function ProjectList({ projects, onDelete }: ProjectListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getStatusCount = (tasks: Task[], status: Task['status']) => {
    return tasks.filter((task) => task.status === status).length
  }

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await onDelete(id)
      toast.success('Project deleted successfully')
    } catch (error) {
      toast.error('Failed to delete project')
    } finally {
      setDeletingId(null)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/projects/${id}/edit`)
  }

  const handleAddTask = (id: string) => {
    router.push(`/dashboard/projects/${id}/tasks/new`)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>
                  <button
                    className="hover:underline text-left"
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    title="View project details"
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
                  >
                    {project.name}
                  </button>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(project.id)}
                  title="Edit project"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                  title="Delete project"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <Badge variant="outline">
                  {project.tasks.length} Tasks
                </Badge>
                <Button
                  variant="link"
                  onClick={() => handleAddTask(project.id)}
                >
                  Add Task
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold">Todo</div>
                  <div>{getStatusCount(project.tasks, 'TODO')}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">In Progress</div>
                  <div>{getStatusCount(project.tasks, 'IN_PROGRESS')}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Review</div>
                  <div>{getStatusCount(project.tasks, 'REVIEW')}</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">Done</div>
                  <div>{getStatusCount(project.tasks, 'DONE')}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 