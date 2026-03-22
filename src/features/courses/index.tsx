import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { CoursesTable } from './components/courses-table'

export function Courses() {
  const navigate = useNavigate()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Курсы</h2>
        </div>

        {ability.can('create', 'courses') ? (
          <Button
            className='space-x-1'
            onClick={() => navigate({ to: '/courses/create' })}
          >
            <span>Создать курс</span>
            <Plus size={18} />
          </Button>
        ) : null}
      </div>

      <CoursesTable />
    </Main>
  )
}
