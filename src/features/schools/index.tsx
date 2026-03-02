import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Main } from '@/components/layout/main'
import { SchoolsTable } from './components/schools-table.tsx'

export function Schools() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Школы</h2>
          </div>
          <Button
            className='space-x-1'
            onClick={() => navigate({ to: '/schools/create' })}
          >
            <span>Создать школу</span> <Plus size={18} />
          </Button>
        </div>
        <SchoolsTable />
      </Main>
    </>
  )
}
