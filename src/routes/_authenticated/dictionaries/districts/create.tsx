import { createFileRoute } from '@tanstack/react-router'
import { DistrictsCreate } from '@/features/dictionaries/districts/create.tsx'
import { fetchAll } from '@/api/dictionaries/regions'

export const Route = createFileRoute('/_authenticated/dictionaries/districts/create')({
  beforeLoad: async () => {
    const regions = await fetchAll()
    return {
      regions
    }
  },
  component: DistrictsCreate,
})
