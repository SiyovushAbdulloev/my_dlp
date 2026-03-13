import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { LessonTopics } from '@/features/lesson-topics'

export const Route = createFileRoute('/_authenticated/lesson-topics/')({
  component: LessonTopics,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'lesson_topics')
    }
  },
})
