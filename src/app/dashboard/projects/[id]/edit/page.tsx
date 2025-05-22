import { getProject, updateProject } from '@/lib/actions/project'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface EditProjectPageProps {
  params: {
    id: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!session) {
    redirect('/login')
  }

  if (!organizationId) {
    redirect('/dashboard?error=no_organization')
  }

  const { data: project } = await getProject(params.id)

  if (!project) {
    notFound()
  }

  if (project.organizationId !== organizationId) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
        <ProjectForm
          initialData={project}
          organizationId={organizationId}
          onSubmit={async (data) => {
            'use server'
            await updateProject(params.id, data)
            redirect('/dashboard/projects')
          }}
        />
      </div>
    </div>
  )
} 