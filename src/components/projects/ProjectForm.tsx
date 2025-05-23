'use client'

import { ProjectInput } from '@/lib/actions/project'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  organizationId: z.string().min(1, 'Organization ID is required'),
})

interface ProjectFormProps {
  initialData?: ProjectInput
  onSubmit: (data: ProjectInput) => Promise<void>
  organizationId: string
}

export function ProjectForm({
  initialData,
  onSubmit,
  organizationId,
}: ProjectFormProps) {
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      organizationId,
    },
  })

  const handleSubmit = async (data: z.infer<typeof projectSchema>) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  )
} 