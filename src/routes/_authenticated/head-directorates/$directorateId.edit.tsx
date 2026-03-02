import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/education-departments'
import { HeadDirectoratesEdit } from '@/features/head-directorate/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/head-directorates/$directorateId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { directorateId } = params
    const directorate = await getById(directorateId)
    if (!directorate) {
      throw new Error('Directorate not found')
    }

    return {
      directorate,
    }
  },
  component: HeadDirectoratesEdit,
})
