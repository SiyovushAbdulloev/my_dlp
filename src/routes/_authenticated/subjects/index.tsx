import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Subjects } from '@/features/subjects'

export const Route = createFileRoute('/_authenticated/subjects/')({
  component: Subjects,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'subjects')
    }
  },
})
