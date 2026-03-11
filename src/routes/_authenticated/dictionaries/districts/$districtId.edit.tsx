import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/dictionaries/districts'
import { fetchAll } from '@/api/dictionaries/regions'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { DistrictsEdit } from '@/features/dictionaries/districts/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/districts/$districtId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'districts')
    }
    const { districtId } = params
    const district = await getById(districtId)
    if (!district) {
      throw new Error('District not found')
    }
    const regions = await fetchAll()

    return {
      district: district.data,
      regions: regions.data,
    }
  },
  component: DistrictsEdit,
})
