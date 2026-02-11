import { createFileRoute } from '@tanstack/react-router'
import { SubjectsEdit } from '@/features/subjects/edit.tsx'
import { getById } from '@/api/subjects'

export const Route = createFileRoute(
  '/_authenticated/subjects/$subjectId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { subjectId } = params
    const subject = await getById(subjectId)
    if (!subject) {
      throw new Error('Subject not found')
    }

    return {
      subject,
    }
  },
  component: SubjectsEdit,
})
