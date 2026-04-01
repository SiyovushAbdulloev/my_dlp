import { useNavigate } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability'
import { AdminIndexPage } from '@/components/admin/index-page'
import { LessonTopicsTable } from './components/lesson-topics-table'

export function LessonTopics() {
  const navigate = useNavigate()

  return (
    <AdminIndexPage
      title='Темы уроков'
      createLabel='Создать'
      canCreate={ability.can('create', 'lesson_topics')}
      onCreate={() => navigate({ to: '/lesson-topics/create' })}
    >
      <LessonTopicsTable />
    </AdminIndexPage>
  )
}
