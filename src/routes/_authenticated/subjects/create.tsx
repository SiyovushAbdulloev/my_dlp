import { createFileRoute } from '@tanstack/react-router'
import { SubjectsCreate } from '@/features/subjects/create.tsx'

export const Route = createFileRoute('/_authenticated/subjects/create')({
  component: SubjectsCreate,
})
