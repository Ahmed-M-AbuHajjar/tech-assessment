import { getProjects } from '@/lib/actions/project'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default async function BacklogPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await auth()
  const organizationId = session?.user?.organizationId

  if (!organizationId) {
    redirect('/dashboard')
  }

  const { data: projects } = await getProjects(organizationId)
  const allTasks = (projects || []).flatMap((project) =>
    (project.tasks || []).map((task) => ({ ...task, project }))
  )

  const q = searchParams.q?.toLowerCase() || ''
  const filteredTasks = allTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(q) ||
      task.project.name.toLowerCase().includes(q) ||
      (task.assignedTo?.name?.toLowerCase().includes(q) ?? false)
  )

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Backlog</h1>
        <form method="get">
          <Input
            name="q"
            placeholder="Search tasks, projects, assignees..."
            defaultValue={searchParams.q || ''}
            className="w-64"
          />
        </form>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Task</th>
              <th className="px-4 py-2 text-left">Project</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Assignee</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-t">
                <td className="px-4 py-2">{task.title}</td>
                <td className="px-4 py-2">{task.project.name}</td>
                <td className="px-4 py-2">{task.status}</td>
                <td className="px-4 py-2">{task.priority}</td>
                <td className="px-4 py-2">{task.assignedTo?.name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 