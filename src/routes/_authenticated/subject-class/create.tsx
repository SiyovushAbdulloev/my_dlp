import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/subjects'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { SubjectClassCreate } from '@/features/subject-class/create.tsx'

export const Route = createFileRoute('/_authenticated/subject-class/create')({
  beforeLoad: async () => {
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subjects,
      classes
    }
  },
  component: SubjectClassCreate,
})
