import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/dictionaries/cities'
import { CitiesEdit } from '@/features/dictionaries/cities/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/cities/$cityId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { cityId } = params
    const city = await getById(cityId)
    if (!city) {
      throw new Error('City not found')
    }

    return {
      city: city.data,
    }
  },
  component: CitiesEdit,
})
