import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { RegionsCreate } from '@/features/dictionaries/regions/create'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/regions/create'
)({
  component: RegionsCreate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'regions')
    }
  },
})
