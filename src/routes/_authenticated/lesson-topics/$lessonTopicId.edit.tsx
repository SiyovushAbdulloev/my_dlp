import { createFileRoute } from '@tanstack/react-router'
import { fetchAll as fetchAllClasses } from '@/api/classes'
import { getById } from '@/api/lesson-topics'
import { fetchAll } from '@/api/subjects'
import { LessonTopicEdit } from '@/features/lesson-topics/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/lesson-topics/$lessonTopicId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { lessonTopicId } = params
    const topic = await getById(lessonTopicId)
    if (!topic) {
      throw new Error('Topic not found')
    }
    const subjects = await fetchAll()
    const classes = await fetchAllClasses()

    return {
      topic,
      subjects,
      classes,
    }
  },
  component: LessonTopicEdit,
})
