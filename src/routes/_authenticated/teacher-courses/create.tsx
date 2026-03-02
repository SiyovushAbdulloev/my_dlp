import { createFileRoute } from '@tanstack/react-router'
import { RegionsCreate } from '@/features/dictionaries/regions/create'

export const Route = createFileRoute(
  '/_authenticated/teacher-courses/create'
)({
  component: RegionsCreate,
})
