import { createFileRoute } from '@tanstack/react-router'
import { HeadDirectorate } from '@/features/head-directorate'

export const Route = createFileRoute('/_authenticated/head-directorates/')({
  component: HeadDirectorate,
})
