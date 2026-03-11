import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Cities } from '@/features/dictionaries/cities'

export const Route = createFileRoute('/_authenticated/dictionaries/cities/')({
  component: Cities,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'cities')
    }
  },
})
