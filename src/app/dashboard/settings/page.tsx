'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getCurrentUserData, updateUserAvatar } from '@/lib/actions/user'
import { ProfileForm } from '@/components/settings/ProfileForm'
import { PasswordForm } from '@/components/settings/PasswordForm'
import { ThemeToggle } from '@/components/settings/ThemeToggle'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sendingVerification, setSendingVerification] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const userData = await getCurrentUserData()
        
        if (!userData) {
          setError('Failed to load user data')
          return
        }

        setUser(userData)
      } catch (err) {
        console.error('Error loading user:', err)
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      
      // Update user avatar using server action
      await updateUserAvatar(user.id, data.url)
      setUser({ ...user, image: data.url })
      toast.success('Avatar updated successfully')
    } catch (error) {
      toast.error('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSendVerification = async () => {
    try {
      setSendingVerification(true)
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      })

      if (!response.ok) {
        throw new Error('Failed to send verification email')
      }

      toast.success('Verification email sent! Please check your inbox.')
    } catch (error) {
      toast.error('Failed to send verification email')
    } finally {
      setSendingVerification(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error || !user) {
    return <div>Error loading settings</div>
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Verification</Label>
              <div className="flex items-center space-x-2">
                <p className="text-sm">
                  {user?.emailVerified ? 'Email verified' : 'Email not verified'}
                </p>
                {!user?.emailVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={sendingVerification}
                  >
                    {sendingVerification ? 'Sending...' : 'Send Verification Email'}
                  </Button>
                )}
              </div>
            </div>

            <ProfileForm user={user} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeToggle />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 