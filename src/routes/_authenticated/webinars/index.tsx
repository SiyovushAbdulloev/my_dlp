import { createFileRoute } from '@tanstack/react-router'
import { Webinars } from '@/features/webinars'

export const Route = createFileRoute('/_authenticated/webinars/')({
  component: Webinars,
})
