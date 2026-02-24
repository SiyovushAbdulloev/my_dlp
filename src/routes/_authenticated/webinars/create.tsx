import { createFileRoute } from '@tanstack/react-router'
import { WebinarsCreate } from '@/features/webinars/create.tsx'

export const Route = createFileRoute('/_authenticated/webinars/create')({
  component: WebinarsCreate,
})
