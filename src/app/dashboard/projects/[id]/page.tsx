import { getProject } from '@/lib/actions/project'
import { getTasks } from '@/lib/actions/task'
import { KanbanBoard } from '@/components/projects/KanbanBoard'
import { BacklogTable } from '@/components/projects/BacklogTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

async function revalidateTasks() {
  'use server'
  revalidatePath('/dashboard/projects/[id]')
}

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const [{ data: project }, { data: tasks }] = await Promise.all([
    getProject(params.id),
    getTasks(params.id),
  ])

  if (!project) {
    redirect('/dashboard/projects')
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-500 mt-1">{project.description}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          <TabsTrigger value="backlog">Backlog</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="space-y-4">
          <KanbanBoard
            tasks={tasks || []}
            onTaskUpdate={revalidateTasks}
          />
        </TabsContent>
        <TabsContent value="backlog" className="space-y-4">
          <BacklogTable tasks={tasks || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 