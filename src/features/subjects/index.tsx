import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button.tsx'
import { Main } from '@/components/layout/main'
import { SubjectsTable } from './components/subjects-table.tsx'

export function Subjects() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Предметы</h2>
          </div>
          {ability.can('create', 'subjects') ? (
            <Button
              className='space-x-1'
              onClick={() => navigate({ to: '/subjects/create' })}
            >
              <span>Создать предмет</span> <Plus size={18} />
            </Button>
          ) : null}
        </div>
        <SubjectsTable />
      </Main>
    </>
  )
}
