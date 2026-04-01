import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { HeadDirectoratesTable } from './components/head-directorates-table'

export function HeadDirectorate() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Сарраёсатхо'
      createLabel='Создать'
      canCreate={ability.can('create', 'head_directorates')}
      onCreate={() => navigate({ to: '/head-directorates/create' })}
    >
      <HeadDirectoratesTable />
    </AdminIndexPage>
  )
}
