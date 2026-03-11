import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/dictionaries/regions'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { RegionsEdit } from '@/features/dictionaries/regions/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/regions/$regionId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'regions')
    }
    const { regionId } = params
    const region = await getById(regionId)
    if (!region) {
      throw new Error('Region not found')
    }

    return {
      region: region.data,
    }
  },
  component: RegionsEdit,
})
