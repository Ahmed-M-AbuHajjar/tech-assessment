'use client'

import { Task, Status } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { updateTaskStatus } from '@/lib/actions/task'

interface KanbanBoardProps {
  tasks: (Task & {
    assignedTo: {
      name: string
    } | null
  })[]
}

const statusColumns: { id: Status; title: string }[] = [
  { id: 'TODO', title: 'Todo' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'Review' },
  { id: 'DONE', title: 'Done' },
]

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const router = useRouter()

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, status: Status) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    await updateTaskStatus(taskId, status)
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className="bg-gray-50 p-4 rounded-lg"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <h3 className="font-semibold mb-4">{column.title}</h3>
          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <Card
                  key={task.id}
                  className="cursor-pointer"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        {task.description}
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge
                          variant={
                            task.priority === 'HIGH'
                              ? 'destructive'
                              : task.priority === 'MEDIUM'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {task.priority}
                        </Badge>
                        {task.assignedTo && (
                          <span className="text-sm">
                            {task.assignedTo.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
} 