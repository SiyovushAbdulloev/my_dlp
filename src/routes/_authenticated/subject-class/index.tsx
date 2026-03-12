import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { SubjectClass } from '@/features/subject-class'

export const Route = createFileRoute('/_authenticated/subject-class/')({
  component: SubjectClass,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'subject_class')
    }
  },
})
