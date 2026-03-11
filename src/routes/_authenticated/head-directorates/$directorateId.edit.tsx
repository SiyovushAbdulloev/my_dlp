import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/head-directorates'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { HeadDirectoratesEdit } from '@/features/head-directorate/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/head-directorates/$directorateId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'head_directorates')
    }
    const { directorateId } = params
    const directorate = await getById(directorateId)
    if (!directorate) {
      throw new Error('Directorate not found')
    }

    return {
      directorate: directorate.data,
    }
  },
  component: HeadDirectoratesEdit,
})
