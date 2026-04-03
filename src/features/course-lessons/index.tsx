import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/lessons'
import { ArrowLeft } from 'lucide-react'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminIndexPage } from '@/components/admin/index-page'
import { CourseLessonsTable } from './components/course-lessons-table'

export function CourseLessons() {
  const navigate = useNavigate()
  const { course, module } = Route.useRouteContext()

  return (
    <AdminIndexPage
      title='Уроки модуля'
      subtitle={`${course.title.ru} / ${module.title.ru}`}
      createLabel='Создать урок'
      canCreate={ability.can('create', 'course_lessons')}
      onCreate={() =>
        navigate({
          to: '/courses/$courseId/modules/$moduleId/lessons/create',
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
      <CourseLessonsTable />
    </AdminIndexPage>
  )
}
