import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Classes } from '@/features/classes'

export const Route = createFileRoute('/_authenticated/classes/')({
  component: Classes,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'school_classes')
    }
  },
})
