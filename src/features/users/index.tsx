import { getRouteApi } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { UsersTable } from './components/users-table'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const navigate = route.useNavigate()

  return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Пользователи</h2>
          </div>
          <Button className='space-x-1' onClick={() => navigate({to: '/users/create'})}>
            <span>Создать пользователя</span> <Plus size={18} />
          </Button>
        </div>
        <UsersTable />
      </Main>
  )
}
