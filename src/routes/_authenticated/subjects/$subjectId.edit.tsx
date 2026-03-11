import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/subjects'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { SubjectsEdit } from '@/features/subjects/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'subjects')
    }
    const { subjectId } = params
    const subject = await getById(subjectId)
    if (!subject) {
      throw new Error('Subject not found')
    }

    return {
      subject: subject.data,
    }
  },
  component: SubjectsEdit,
})
