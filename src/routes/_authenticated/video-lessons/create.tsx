import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/classes'
import { fetchAll as fetchAllSubjects } from '@/api/subjects'
import { VideoLessonsCreate } from '@/features/video-lessons/create.tsx'

export const Route = createFileRoute('/_authenticated/video-lessons/create')({
  beforeLoad: async () => {
    const classes = await fetchAll()
    const subjects = await fetchAllSubjects()

    return {
      classes,
      subjects,
    }
  },
  component: VideoLessonsCreate,
})
