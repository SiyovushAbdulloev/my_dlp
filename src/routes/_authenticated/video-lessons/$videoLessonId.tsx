import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/video-lessons'
import { VideoLessonsShow } from '@/features/video-lessons/show.tsx'

export const Route = createFileRoute(
  '/_authenticated/video-lessons/$videoLessonId'
)({
  beforeLoad: async ({ params }) => {
    const { videoLessonId } = params
    const lesson = await getById(videoLessonId)
    if (!lesson) {
      throw new Error('Video lesson not found')
    }

    return {
      lesson,
    }
  },
  component: VideoLessonsShow,
})
