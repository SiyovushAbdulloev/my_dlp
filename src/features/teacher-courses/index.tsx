// src/features/teacher-courses/index.tsx
import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { TeacherCoursesTable } from '@/features/teacher-courses/components/teacher-courses-table.tsx'

export function TeacherCourses() {
  const navigate = useNavigate()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Курсы учителей</h2>
        </div>

        <Button
          className='space-x-1'
          onClick={() => navigate({ to: '/teacher-courses/create' })}
        >
          <span>Создать курс</span> <Plus size={18} />
        </Button>
      </div>

      <TeacherCoursesTable />
    </Main>
  )
}
