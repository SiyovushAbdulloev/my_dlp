import { createFileRoute } from '@tanstack/react-router'
import { getById as getByIdModule } from '@/api/course-modules'
import { getById } from '@/api/courses'
import { getById as getByIdQuestion } from '@/api/module-questions'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { ModuleQuestionAnswersCreate } from '@/features/module-question-answer/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/answers/create'
)({
  component: ModuleQuestionAnswersCreate,
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'course_module_question_answers')
    }

    const { courseId, moduleId, questionId } = params
    const course = await getById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    const module = await getByIdModule(courseId, moduleId)
    if (!module) {
      throw new Error('Course module not found')
    }
    const question = await getByIdQuestion(courseId, moduleId, questionId)
    if (!question) {
      throw new Error('Module question not found')
    }

    return {
      course: course.data,
      module: module.data,
      question: question.data,
    }
  },
})
