import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/webinars'
import { WebinarsShow } from '@/features/webinars/show.tsx'

export const Route = createFileRoute(
  '/_authenticated/webinars/$webinarId'
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
  component: WebinarsShow,
})
