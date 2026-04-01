import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { SubjectClassTable } from '@/features/subject-class/components/subject-class-table'

export function SubjectClass() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Предметы-Классы'
      createLabel='Прикрепить'
      canCreate={ability.can('create', 'subject_class')}
      onCreate={() => navigate({ to: '/subject-class/create' })}
    >
      <SubjectClassTable />
    </AdminIndexPage>
  )
}
