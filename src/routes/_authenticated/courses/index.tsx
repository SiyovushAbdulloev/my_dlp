import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Courses } from '@/features/courses'

export const Route = createFileRoute('/_authenticated/courses/')({
  component: Courses,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'courses')
    }
  },
})
