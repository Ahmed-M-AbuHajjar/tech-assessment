import { getTask } from '@/lib/actions/task'
import { getEmployees } from '@/lib/actions/employee'
import { TaskForm } from '@/components/tasks/TaskForm'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface TaskDetailPageProps {
  params: {
    id: string
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!organizationId) {
    redirect('/dashboard')
  }

  const [{ data: task }, { data: employees }] = await Promise.all([
    getTask(params.id),
    getEmployees(organizationId),
  ])

  if (!task) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/dashboard/projects/${task.projectId}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Edit Task</h1>
        </div>
        <TaskForm
          initialData={task}
          projectId={task.projectId}
          employees={employees || []}
          onSubmit={async (data) => {
            'use server'
            const { updateTask } = await import('@/lib/actions/task')
            await updateTask(params.id, data)
            redirect(`/dashboard/projects/${task.projectId}`)
          }}
        />
      </div>
    </div>
  )
} 