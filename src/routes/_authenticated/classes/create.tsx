import { createFileRoute } from '@tanstack/react-router'
import { ClassesCreate } from '@/features/classes/create.tsx'

export const Route = createFileRoute('/_authenticated/classes/create')({
  component: ClassesCreate,
})
