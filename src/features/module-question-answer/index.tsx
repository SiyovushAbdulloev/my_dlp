import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/answers'
import { ArrowLeft } from 'lucide-react'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminIndexPage } from '@/components/admin/index-page'
import { ModuleQuestionAnswersTable } from './components/module-question-answers-table'

export function ModuleQuestionAnswers() {
  const navigate = useNavigate()
  const { course, module, question } = Route.useRouteContext()

  return (
    <AdminIndexPage
      title='Ответы'
      subtitle={`${course.title.ru} / ${module.title.ru}`}
      createLabel='Создать ответ'
      canCreate={ability.can('create', 'course_module_question_answers')}
      onCreate={() =>
        navigate({
          to: '/courses/$courseId/modules/$moduleId/questions/$questionId/answers/create',
          params: {
            courseId: course.id,
            moduleId: module.id,
            questionId: question.id,
          },
        })
      }
      actions={
        <Button
          variant='outline'
          onClick={() =>
            navigate({
              to: '/courses/$courseId/modules/$moduleId/questions',
              params: { courseId: course.id, moduleId: module.id },
            })
          }
        >
          <ArrowLeft className='size-4' />
          Вопросы
        </Button>
      }
    >
      <div className='rounded-2xl border bg-white p-4 text-sm text-slate-700 shadow-sm'>
        <div className='font-medium'>Вопрос</div>
        <div className='mt-1'>{question.text.ru}</div>
      </div>

      <ModuleQuestionAnswersTable />
    </AdminIndexPage>
  )
}
