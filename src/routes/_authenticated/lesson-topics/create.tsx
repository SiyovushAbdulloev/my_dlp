import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { fetchAll } from '@/api/subjects'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { LessonTopicCreate } from '@/features/lesson-topics/create.tsx'

export const Route = createFileRoute('/_authenticated/lesson-topics/create')({
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'lesson_topics')
    }
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      subjects,
      classes,
    }
  },
  component: LessonTopicCreate,
})
