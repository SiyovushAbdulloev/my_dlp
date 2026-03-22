import { createFileRoute } from '@tanstack/react-router'
import { getById as getByIdLesson } from '@/api/course-lessons'
import { getById as getByIdModule } from '@/api/course-modules'
import { getById } from '@/api/courses'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CourseLessonsEdit } from '@/features/course-lessons/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/$moduleId/lessons/$lessonId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'course_lessons')
    }
    const { courseId, moduleId, lessonId } = params
    const course = await getById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    const module = await getByIdModule(courseId, moduleId)
    if (!module) {
      throw new Error('Module not found')
    }
    const lesson = await getByIdLesson(courseId, moduleId, lessonId)
    if (!lesson) {
      throw new Error('Lesson not found')
    }

    return {
      course: course.data,
      module: module.data,
      lesson: lesson.data,
    }
  },
  component: CourseLessonsEdit,
})
