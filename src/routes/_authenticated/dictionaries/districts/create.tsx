import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/dictionaries/regions'
import { DistrictsCreate } from '@/features/dictionaries/districts/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/districts/create'
)({
  beforeLoad: async () => {
    const regions = await fetchAll()
    return {
      regions,
    }
  },
  component: DistrictsCreate,
})
