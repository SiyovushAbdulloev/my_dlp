import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/classes'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { ClassesEdit } from '@/features/classes/edit.tsx'

export const Route = createFileRoute('/_authenticated/classes/$classId/edit')({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'school_classes')
    }
    const { classId } = params
    const classObj = await getById(classId)
    if (!classObj) {
      throw new Error('Class not found')
    }

    return {
      classObj: classObj.data,
    }
  },
  component: ClassesEdit,
})
