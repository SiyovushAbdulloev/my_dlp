import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/answers'
import { ArrowLeft, Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { ModuleQuestionAnswersTable } from './components/module-question-answers-table'

export function ModuleQuestionAnswers() {
  const navigate = useNavigate()
  const { course, module, question } = Route.useRouteContext()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Ответы</h2>
          <p className='text-sm text-muted-foreground'>
            {course.title.ru} / {module.title.ru}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() =>
              navigate({
                to: '/courses/$courseId/modules/$moduleId/questions',
                params: { courseId: course.id, moduleId: module.id },
              })
            }
          >
            <ArrowLeft size={18} />
            Вопросы
          </Button>

          {ability.can('create', 'course_module_question_answers') ? (
            <Button
              className='space-x-1'
              onClick={() =>
                navigate({
                  to: '/courses/$courseId/modules/$moduleId/questions/$questionId/answers/create',
                  params: {
                    courseId: course.id,
                    moduleId: module.id,
                    questionId: question.id,
                  },
                })
              }
            >
              <span>Создать ответ</span>
              <Plus size={18} />
            </Button>
          ) : null}
        </div>
      </div>

      <div className='rounded-2xl border bg-white p-4 text-sm text-slate-700'>
        <div className='font-medium'>Вопрос</div>
        <div className='mt-1'>{question.text.ru}</div>
      </div>

      <ModuleQuestionAnswersTable />
    </Main>
  )
}
