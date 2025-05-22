'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AddTaskButtonProps {
  projectId: string
}

export function AddTaskButton({ projectId }: AddTaskButtonProps) {
  const router = useRouter()

  return (
    <Button onClick={() => router.push(`/dashboard/projects/${projectId}/tasks/new`)}>
      <Plus className="mr-2 h-4 w-4" />
      Add Task
    </Button>
  )
} 