'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function AddEmployeeButton() {
  const router = useRouter()
  const { data: session } = useSession()

  const handleClick = () => {
    if (!session?.user) {
      router.push('/login')
      return
    }
    router.push('/dashboard/employees/new')
  }

  return (
    <Button onClick={handleClick}>
      <Plus className="mr-2 h-4 w-4" />
      Add Employee
    </Button>
  )
} 