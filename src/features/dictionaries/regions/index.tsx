import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { RegionsTable } from './components/regions-table'

export function Regions() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Регионы'
      createLabel='Создать'
      canCreate={ability.can('create', 'regions')}
      onCreate={() => navigate({ to: '/dictionaries/regions/create' })}
    >
      <RegionsTable />
    </AdminIndexPage>
  )
}
