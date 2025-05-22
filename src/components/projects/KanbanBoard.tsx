'use client'

import { Task } from '@prisma/client'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { updateTaskStatus } from '@/lib/actions/task'
import { toast } from 'sonner'

interface KanbanBoardProps {
  tasks: Task[]
  onTaskUpdate: () => void
}

const columns = {
  TODO: {
    title: 'To Do',
    color: 'bg-gray-100',
  },
  IN_PROGRESS: {
    title: 'In Progress',
    color: 'bg-blue-100',
  },
  REVIEW: {
    title: 'Review',
    color: 'bg-yellow-100',
  },
  DONE: {
    title: 'Done',
    color: 'bg-green-100',
  },
}

export function KanbanBoard({ tasks, onTaskUpdate }: KanbanBoardProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as keyof typeof columns

    try {
      await updateTaskStatus(taskId, newStatus)
      onTaskUpdate()
      toast.success('Task status updated')
    } catch (error) {
      toast.error('Failed to update task status')
    }
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 h-full">
        {Object.entries(columns).map(([status, { title, color }]) => (
          <div key={status} className="flex flex-col">
            <div className="mb-2">
              <h3 className="font-semibold">{title}</h3>
              <Badge variant="secondary" className="mt-1">
                {getTasksByStatus(status).length}
              </Badge>
            </div>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-2 rounded-lg ${color} min-h-[500px]`}
                >
                  {getTasksByStatus(status).map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2"
                        >
                          <Card>
                            <CardContent className="p-4">
                              <h4 className="font-medium">{task.title}</h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {task.description}
                              </p>
                              {task.dueDate && (
                                <p className="text-xs text-gray-400 mt-2">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
} 