import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/video-lessons'
import { VideoLessonsShow } from '@/features/video-lessons/show.tsx'

export const Route = createFileRoute(
  '/_authenticated/video-lessons/$videoLessonId/show'
)({
  beforeLoad: async ({ params }) => {
    const { videoLessonId } = params
    console.log(videoLessonId)
    const lesson = await getById(videoLessonId)
    console.log({ lesson })
    if (!lesson) {
      throw new Error('Video lesson not found')
    }

    return {
      lesson: lesson.data,
    }
  },
  component: VideoLessonsShow,
})
