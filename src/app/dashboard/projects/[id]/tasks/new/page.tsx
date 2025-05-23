import { createTask } from '@/lib/actions/task'
import { getEmployees } from '@/lib/actions/employee'
import { getProject } from '@/lib/actions/project'
import { TaskForm } from '@/components/tasks/TaskForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface NewTaskPageProps {
  params: {
    id: string
  }
}

export default async function NewTaskPage({ params }: NewTaskPageProps) {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!session) {
    redirect('/login')
  }

  if (!organizationId) {
    redirect('/dashboard?error=no_organization')
  }

  const [{ data: project }, { data: employees }] = await Promise.all([
    getProject(params.id),
    getEmployees(organizationId),
  ])

  if (!project) {
    notFound()
  }

  if (project.organizationId !== organizationId) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Task</h1>
        <TaskForm
          projectId={params.id}
          employees={employees || []}
          onSubmit={async (data) => {
            'use server'
            await createTask(data)
            redirect(`/dashboard/projects/${params.id}`)
          }}
        />
      </div>
    </div>
  )
} 