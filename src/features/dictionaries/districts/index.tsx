import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { DistrictsTable } from './components/districts-table'

export function Districts() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Районы'
      createLabel='Создать'
      canCreate={ability.can('list', 'districts')}
      onCreate={() => navigate({ to: '/dictionaries/districts/create' })}
    >
      <DistrictsTable />
    </AdminIndexPage>
  )
}
