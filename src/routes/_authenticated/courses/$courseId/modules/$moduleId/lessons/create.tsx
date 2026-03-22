import { createFileRoute } from '@tanstack/react-router'
import { getById as getByIdModule } from '@/api/course-modules'
import { getById } from '@/api/courses'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CourseLessonsCreate } from '@/features/course-lessons/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/$moduleId/lessons/create'
)({
  component: CourseLessonsCreate,
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'course_lessons')
    }

    const { courseId, moduleId } = params
    const course = await getById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    const module = await getByIdModule(courseId, moduleId)
    if (!module) {
      throw new Error('Course module not found')
    }

    return {
      course: course.data,
      module: module.data,
    }
  },
})
