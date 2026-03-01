import { createFileRoute } from '@tanstack/react-router'
import { LessonTopicCreate } from '@/features/lesson-topics/create.tsx'
import { fetchAll } from '@/api/subjects'
import { fetchAll as fetchAllClasses } from '@/api/classes'

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
