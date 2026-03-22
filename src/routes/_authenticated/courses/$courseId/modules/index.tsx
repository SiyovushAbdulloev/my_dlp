import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/courses'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CourseModules } from '@/features/course-modules'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/'
)({
  component: CourseModules,
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'course_modules')
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
