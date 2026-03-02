import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { fetchAll } from '@/api/subjects'
import { LessonTopicCreate } from '@/features/lesson-topics/create.tsx'

export const Route = createFileRoute('/_authenticated/lesson-topics/create')({
  beforeLoad: async () => {
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subjects,
      classes,
    }
  },
  component: LessonTopicCreate,
})
