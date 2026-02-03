import { createFileRoute } from '@tanstack/react-router'
import { SchoolsCreate } from '@/features/schools/create'

export const Route = createFileRoute('/_authenticated/schools/create')({
  component: SchoolsCreate,
})
