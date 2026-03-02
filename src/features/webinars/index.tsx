import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Main } from '@/components/layout/main'
import { WebinarsTable } from './components/webinars-table.tsx'

export function Webinars() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Вебинары</h2>
          </div>
          <Button
            className='space-x-1'
            onClick={() => navigate({ to: '/webinars/create' })}
          >
            <span>Создать вебинар</span> <Plus size={18} />
          </Button>
        </div>
        <WebinarsTable />
      </Main>
    </>
  )
}
