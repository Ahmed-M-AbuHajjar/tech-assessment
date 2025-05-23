'use client'

import { Project } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.description && (
          <p className="text-muted-foreground mt-2">{project.description}</p>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
} 