import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/schools'
import { SchoolsEdit } from '@/features/schools/edit.tsx'

export const Route = createFileRoute('/_authenticated/schools/$schoolId/edit')({
  beforeLoad: async ({ params }) => {
    const { schoolId } = params
    const school = await getById(schoolId)
    if (!school) {
      throw new Error('School not found')
    }

    return {
      school,
    }
  },
  component: SchoolsEdit,
})
