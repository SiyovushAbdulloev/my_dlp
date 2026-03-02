import { createFileRoute } from '@tanstack/react-router'
import { HeadDirectoratesCreate } from '@/features/head-directorate/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/head-directorates/create'
)({
  component: HeadDirectoratesCreate,
})
