import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { ClassesTable } from './components/classes-table'

export function Classes() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Классы'
      createLabel='Создать'
      canCreate={ability.can('list', 'school_classes')}
      onCreate={() => navigate({ to: '/classes/create' })}
    >
      <ClassesTable />
    </AdminIndexPage>
  )
}
