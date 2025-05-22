'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { verifyEmail } from '@/lib/actions/user'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    const handleVerification = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        toast.error('Invalid verification link')
        router.push('/dashboard/settings')
        return
      }

      try {
        const result = await verifyEmail(token)

        if (!result.success) {
          toast.error(result.error || 'Failed to verify email')
          router.push('/dashboard/settings')
          return
        }

        toast.success('Email verified successfully!')
        router.push('/dashboard/settings')
      } catch (error) {
        console.error('Verification error:', error)
        toast.error('Failed to verify email')
        router.push('/dashboard/settings')
      } finally {
        setVerifying(false)
      }
    }

    handleVerification()
  }, [searchParams, router])

  if (verifying) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
          <p>Please wait while we verify your email address.</p>
        </div>
      </div>
    )
  }

  return null
} 