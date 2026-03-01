import { createFileRoute } from '@tanstack/react-router'
import { LessonTopics } from '@/features/lesson-topics'

export const Route = createFileRoute('/_authenticated/lesson-topics/')({
  component: LessonTopics,
})
