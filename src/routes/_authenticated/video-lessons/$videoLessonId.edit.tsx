import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/classes'
import { fetchAll as fetchAllSubjects } from '@/api/subjects'
import { getById } from '@/api/video-lessons'
import { VideoLessonsEdit } from '@/features/video-lessons/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/video-lessons/$videoLessonId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { videoLessonId } = params
    const lesson = await getById(videoLessonId)
    const classes = await fetchAll()
    const subjects = await fetchAllSubjects()
    if (!lesson) {
      throw new Error('Video lesson not found')
    }

    return {
      lesson: lesson.data,
      classes,
      subjects,
    }
  },
  component: VideoLessonsEdit,
})
