import { Main } from '@/components/layout/main'
import { DistrictsTable } from './components/districts-table.tsx'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { useNavigate } from '@tanstack/react-router'

export function Districts() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Районы</h2>
          </div>
          <Button className='space-x-1' onClick={() => navigate({to: '/dictionaries/districts/create'})}>
            <span>Создать район</span> <Plus size={18} />
          </Button>
        </div>
        <DistrictsTable />
      </Main>
    </>
  )
}
