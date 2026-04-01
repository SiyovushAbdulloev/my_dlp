import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { CitiesTable } from './components/cities-table'

export function Cities() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Города'
      createLabel='Создать'
      canCreate={ability.can('create', 'cities')}
      onCreate={() => navigate({ to: '/dictionaries/cities/create' })}
    >
      <CitiesTable />
    </AdminIndexPage>
  )
}
