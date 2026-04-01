import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { UsersTable } from './components/users-table'

export function Users() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Пользователи'
      createLabel='Создать'
      canCreate={ability.can('create', 'users')}
      onCreate={() => navigate({ to: '/users/create' })}
    >
      <UsersTable />
    </AdminIndexPage>
  )
}
