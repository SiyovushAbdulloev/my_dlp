import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { RolesTable } from './components/roles-table'

export function Roles() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Роли и права'
      createLabel='Создать'
      canCreate={ability.can('create', 'roles')}
      onCreate={() => navigate({ to: '/roles/create' })}
    >
      <RolesTable />
    </AdminIndexPage>
  )
}
