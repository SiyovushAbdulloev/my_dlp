import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/dictionaries/regions'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { DistrictsCreate } from '@/features/dictionaries/districts/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/districts/create'
)({
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'districts')
    }
    const regions = await fetchAll()
    return {
      regions: regions.data,
    }
  },
  component: DistrictsCreate,
})
