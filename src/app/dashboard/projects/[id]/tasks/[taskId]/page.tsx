import { getTask } from '@/lib/actions/task'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface TaskPageProps {
  params: {
    id: string
    taskId: string
  }
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

export default async function TaskPage({ params }: TaskPageProps) {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!session) {
    redirect('/login')
  }

  if (!organizationId) {
    redirect('/dashboard?error=no_organization')
  }

  const taskResult = await getTask(params.taskId)
  if (!taskResult.success || !taskResult.data) {
    notFound()
  }

  const task = taskResult.data

  if (task.project.organizationId !== organizationId) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/projects/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{task.title}</h1>
        </div>
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/projects/${params.id}/tasks/${task.id}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="text-muted-foreground">
            {task.description || 'No description provided'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Status</h2>
            <Badge className={statusColors[task.status]}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Priority</h2>
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>

        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Assigned To</h2>
          <p className="text-muted-foreground">
            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
          </p>
        </div>

        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Created</h2>
          <p className="text-muted-foreground">
            {format(new Date(task.createdAt), 'PPP')}
          </p>
        </div>

        <div className="grid gap-2">
          <h2 className="text-lg font-semibold">Last Updated</h2>
          <p className="text-muted-foreground">
            {format(new Date(task.updatedAt), 'PPP')}
          </p>
        </div>
      </div>
    </div>
  )
} 