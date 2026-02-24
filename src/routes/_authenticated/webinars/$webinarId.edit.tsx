import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/webinars'
import { WebinarsEdit } from '@/features/webinars/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/webinars/$webinarId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { webinarId } = params
    const webinar = await getById(webinarId)
    if (!webinar) {
      throw new Error('Webinar not found')
    }

    return {
      webinar,
    }
  },
  component: WebinarsEdit,
})
