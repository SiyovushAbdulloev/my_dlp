import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { fetchAll } from '@/api/subjects'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { SubjectClassCreate } from '@/features/subject-class/create.tsx'

export const Route = createFileRoute('/_authenticated/subject-class/create')({
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'subject_class')
    }
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subjects,
      classes,
    }
  },
  component: SubjectClassCreate,
})
