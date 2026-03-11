import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { SubjectsCreate } from '@/features/subjects/create.tsx'

export const Route = createFileRoute('/_authenticated/subjects/create')({
  component: SubjectsCreate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'subjects')
    }
  },
})
