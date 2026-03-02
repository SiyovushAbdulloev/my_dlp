import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/dictionaries/regions'
import { RegionsEdit } from '@/features/dictionaries/regions/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/regions/$regionId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { regionId } = params
    const region = await getById(regionId)
    if (!region) {
      throw new Error('Region not found')
    }

    return {
      region,
    }
  },
  component: RegionsEdit,
})
