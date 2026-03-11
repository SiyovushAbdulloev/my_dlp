import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Districts } from '@/features/dictionaries/districts'

export const Route = createFileRoute('/_authenticated/dictionaries/districts/')(
  {
    component: Districts,
    beforeLoad: ({ context }) => {
      if (context.auth.auth.user) {
        beforeLoadRoute('list', 'districts')
      }
    },
  }
)
