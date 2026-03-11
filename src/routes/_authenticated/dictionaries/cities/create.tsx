import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { CitiesCreate } from '@/features/dictionaries/cities/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/dictionaries/cities/create'
)({
  component: CitiesCreate,
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'cities')
    }
  },
})
