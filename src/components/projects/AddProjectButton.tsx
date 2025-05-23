'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function AddProjectButton() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleClick = () => {
    if (!session?.user?.organizationId) {
      router.push('/dashboard')
      return
    }
    router.push('/dashboard/projects/new')
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Add Project
    </Button>
  )
} 