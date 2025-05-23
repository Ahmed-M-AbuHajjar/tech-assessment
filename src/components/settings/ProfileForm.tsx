'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(user.name ?? '');
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();

  // Update name when user prop changes
  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
    }
  }, [user]);

  // Update name when session changes
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? '');
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: user.email // Keep the existing email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      // Update name with the response
      setName(result.user.name ?? '');

      // Force a session refresh
      await updateSession();
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
} 