import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions'
import { ArrowLeft } from 'lucide-react'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminIndexPage } from '@/components/admin/index-page'
import { ModuleQuestionsTable } from './components/module-questions-table'

export function ModuleQuestions() {
  const navigate = useNavigate()
  const { course, module } = Route.useRouteContext()

  return (
    <AdminIndexPage
      title='Вопросы модуля'
      subtitle={`${course.title.ru} / ${module.title.ru}`}
      createLabel='Создать вопрос'
      canCreate={ability.can('create', 'course_module_questions')}
      onCreate={() =>
        navigate({
          to: '/courses/$courseId/modules/$moduleId/questions/create',
          params: { courseId: course.id, moduleId: module.id },
        })
      }
      actions={
        <Button
          variant='outline'
          onClick={() =>
            navigate({
              to: '/courses/$courseId/modules',
              params: { courseId: course.id },
            })
          }
        >
          <ArrowLeft className='size-4' />
          Модули
        </Button>
      }
    >
      <ModuleQuestionsTable />
    </AdminIndexPage>
  )
}
