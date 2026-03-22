import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/courses'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CoursesEdit } from '@/features/courses/edit.tsx'

export const Route = createFileRoute('/_authenticated/courses/$courseId/edit')({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'courses')
    }
    const { courseId } = params
    const course = await getById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    return {
      course: course.data,
    }
  },
  component: CoursesEdit,
})
