import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/lessons'
import { ArrowLeft, Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { CourseLessonsTable } from './components/course-lessons-table'

export function CourseLessons() {
  const navigate = useNavigate()
  const { course, module } = Route.useRouteContext()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Уроки модуля</h2>
          <p className='text-sm text-muted-foreground'>
            {course.title.ru} / {module.title.ru}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() =>
              navigate({
                to: '/courses/$courseId/modules',
                params: { courseId: course.id },
              })
            }
          >
            <ArrowLeft size={18} />
            Модули
          </Button>

          {ability.can('create', 'course_lessons') ? (
            <Button
              className='space-x-1'
              onClick={() =>
                navigate({
                  to: '/courses/$courseId/modules/$moduleId/lessons/create',
                  params: { courseId: course.id, moduleId: module.id },
                })
              }
            >
              <span>Создать урок</span>
              <Plus size={18} />
            </Button>
          ) : null}
        </div>
      </div>

      <CourseLessonsTable />
    </Main>
  )
}
