import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules'
import { ArrowLeft } from 'lucide-react'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminIndexPage } from '@/components/admin/index-page'
import { CourseModulesTable } from './components/course-modules-table'

export function CourseModules() {
  const navigate = useNavigate()
  const { course } = Route.useRouteContext()

  return (
    <AdminIndexPage
      title='Модули курса'
      subtitle={course.title.ru}
      createLabel='Создать модуль'
      canCreate={ability.can('create', 'course_modules')}
      onCreate={() =>
        navigate({
          to: '/courses/$courseId/modules/create',
          params: { courseId: course.id },
        })
      }
      actions={
        <Button variant='outline' onClick={() => navigate({ to: '/courses' })}>
          <ArrowLeft className='size-4' />
          Курсы
        </Button>
      }
    >
      <CourseModulesTable />
    </AdminIndexPage>
  )
}
