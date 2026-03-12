import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { getById } from '@/api/subject-class'
import { fetchAll } from '@/api/subjects'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { SubjectClassEdit } from '@/features/subject-class/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/subject-class/$subjectClassId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'subject_class')
    }
    const { subjectClassId } = params
    const subject = await getById(subjectClassId)
    if (!subject) {
      throw new Error('Subject not found')
    }
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subject: subject.data,
      subjects,
      classes,
    }
  },
  component: SubjectClassEdit,
})
