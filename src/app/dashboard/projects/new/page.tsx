import { createProject } from '@/lib/actions/project'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewProjectPage() {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!session) {
    redirect('/login')
  }

  if (!organizationId) {
    redirect('/dashboard?error=no_organization')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Project</h1>
        <ProjectForm
          organizationId={organizationId}
          onSubmit={async (data) => {
            'use server'
            await createProject(data)
            redirect('/dashboard/projects')
          }}
        />
      </div>
    </div>
  )
} 