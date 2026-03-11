import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Regions } from '@/features/dictionaries/regions'

export const Route = createFileRoute('/_authenticated/dictionaries/regions/')({
  component: Regions,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'regions')
    }
  },
})
