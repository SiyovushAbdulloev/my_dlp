import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { CourseModulesTable } from './components/course-modules-table'

export function CourseModules() {
  const navigate = useNavigate()
  const { course } = Route.useRouteContext()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Модули курса</h2>
          <p className='text-sm text-muted-foreground'>{course.title.ru}</p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() =>
              navigate({
                to: '/courses',
              })
            }
          >
            <ArrowLeft size={18} />
            Курсы
          </Button>

          <Button
            className='space-x-1'
            onClick={() =>
              navigate({
                to: '/courses/$courseId/modules/create',
                params: { courseId: course.id },
              })
            }
          >
            <span>Создать модуль</span>
            <Plus size={18} />
          </Button>
        </div>
      </div>

      <CourseModulesTable />
    </Main>
  )
}
