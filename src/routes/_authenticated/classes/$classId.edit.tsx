import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/classes'
import { ClassesEdit } from '@/features/classes/edit.tsx'

export const Route = createFileRoute('/_authenticated/classes/$classId/edit')({
  beforeLoad: async ({ params }) => {
    const { classId } = params
    const classObj = await getById(classId)
    if (!classObj) {
      throw new Error('Class not found')
    }

    return {
      classObj,
    }
  },
  component: ClassesEdit,
})
