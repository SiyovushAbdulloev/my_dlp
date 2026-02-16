import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { getById } from '@/api/subject-class'
import { fetchAll } from '@/api/subjects'
import { SubjectClassEdit } from '@/features/subject-class/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/subject-class/$subjectClassId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { subjectClassId } = params
    const subject = await getById(subjectClassId)
    if (!subject) {
      throw new Error('Subject not found')
    }
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subject,
      subjects,
      classes,
    }
  },
  component: SubjectClassEdit,
})
