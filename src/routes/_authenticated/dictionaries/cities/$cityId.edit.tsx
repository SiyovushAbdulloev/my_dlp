import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/dictionaries/cities'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CitiesEdit } from '@/features/dictionaries/cities/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/cities/$cityId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'cities')
    }
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
