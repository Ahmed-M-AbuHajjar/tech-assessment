import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { TaskForm } from '@/components/TaskForm'

export default function CreateTaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleCreateTask = async (data: z.infer<typeof taskSchema>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          assignedEmployeeIds: data.assignedEmployeeIds || [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      router.push(`/dashboard/projects/${params.id}/tasks`)
      router.refresh()
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Task</h1>
      <TaskForm onSubmit={handleCreateTask} projectId={params.id} />
    </div>
  )
} 