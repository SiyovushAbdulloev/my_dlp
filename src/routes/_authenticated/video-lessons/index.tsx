import { createFileRoute } from '@tanstack/react-router'
import { VideoLessons } from '@/features/video-lessons'

export const Route = createFileRoute('/_authenticated/video-lessons/')({
  component: VideoLessons,
})
