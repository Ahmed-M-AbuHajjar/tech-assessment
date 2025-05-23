import { getProjects } from '@/lib/actions/project'
import { ProjectList } from '@/components/projects/ProjectList'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AddProjectButton } from '@/components/projects/AddProjectButton'

export default async function ProjectsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (!session.user.organizationId) {
    redirect('/dashboard?error=no_organization')
  }

  const { data: projects } = await getProjects(session.user.organizationId)

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <AddProjectButton />
      </div>

      <ProjectList
        projects={projects || []}
        onDelete={async (id) => {
          'use server'
          const { deleteProject } = await import('@/lib/actions/project')
          await deleteProject(id)
        }}
      />
    </div>
  )
} 