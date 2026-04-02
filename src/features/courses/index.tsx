import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { CoursesTable } from './components/courses-table'

export function Courses() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Курсы'
      createLabel='Создать'
      canCreate={ability.can('create', 'courses')}
      onCreate={() => navigate({ to: '/courses/create' })}
    >
      <CoursesTable />
    </AdminIndexPage>
  )
}
