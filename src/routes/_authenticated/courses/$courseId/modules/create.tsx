import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/courses'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CourseModulesCreate } from '@/features/course-modules/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/create'
)({
  component: CourseModulesCreate,
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'course_modules')
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
})
