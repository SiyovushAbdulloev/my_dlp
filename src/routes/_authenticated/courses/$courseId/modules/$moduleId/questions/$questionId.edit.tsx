import { createFileRoute } from '@tanstack/react-router'
import { getById as getByIdModule } from '@/api/course-modules'
import { getById } from '@/api/courses'
import { getById as getByIdQuestion } from '@/api/module-questions'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { ModuleQuestionsEdit } from '@/features/module-questions/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'course_module_questions')
    }
    const { courseId, moduleId, questionId } = params
    const course = await getById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    const module = await getByIdModule(courseId, moduleId)
    if (!module) {
      throw new Error('Module not found')
    }
    const question = await getByIdQuestion(courseId, moduleId, questionId)
    if (!question) {
      throw new Error('Question not found')
    }

    return {
      course: course.data,
      module: module.data,
      question: question.data,
    }
  },
  component: ModuleQuestionsEdit,
})
