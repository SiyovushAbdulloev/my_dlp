import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CoursesCreate } from '@/features/courses/create'

export const Route = createFileRoute('/_authenticated/courses/create')({
  component: CoursesCreate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'courses')
    }
  },
})
