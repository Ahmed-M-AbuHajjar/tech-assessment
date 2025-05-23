'use client'

import { getTask, updateTask } from '@/lib/actions/task'
import { getEmployees } from '@/lib/actions/employee'
import { TaskForm } from '@/components/tasks/TaskForm'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { use } from 'react'

interface EditTaskPageProps {
  params: Promise<{
    id: string
    taskId: string
  }>
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const [task, setTask] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const resolvedParams = use(params)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: taskData }, { data: employeesData }] = await Promise.all([
          getTask(resolvedParams.taskId),
          getEmployees(resolvedParams.id),
        ])

        if (!taskData) {
          router.push(`/dashboard/projects/${resolvedParams.id}`)
          return
        }

        setTask(taskData)
        setEmployees(employeesData || [])
      } catch (error) {
        toast.error('Failed to load task data')
        router.push(`/dashboard/projects/${resolvedParams.id}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id, resolvedParams.taskId, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Task</h1>
        <TaskForm
          initialData={{
            ...task,
            assignedEmployeeIds: task.assignedEmployees?.map((e: any) => e.id) || [],
          }}
          projectId={resolvedParams.id}
          employees={employees}
          onSubmit={async (data) => {
            try {
              await updateTask(resolvedParams.taskId, data)
              toast.success('Task updated successfully')
              router.push(`/dashboard/projects/${resolvedParams.id}`)
            } catch (error) {
              toast.error('Failed to update task')
            }
          }}
        />
      </div>
    </div>
  )
} 