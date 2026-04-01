import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { SubjectsTable } from './components/subjects-table'

export function Subjects() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Предметы'
      createLabel='Создать'
      canCreate={ability.can('create', 'subjects')}
      onCreate={() => navigate({ to: '/subjects/create' })}
    >
      <SubjectsTable />
    </AdminIndexPage>
  )
}
