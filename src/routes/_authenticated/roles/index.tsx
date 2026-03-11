import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Roles } from '@/features/roles'

export const Route = createFileRoute('/_authenticated/roles/')({
  component: Roles,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'roles')
    }
  },
})
