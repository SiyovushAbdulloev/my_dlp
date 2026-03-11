import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { HeadDirectorate } from '@/features/head-directorate'

export const Route = createFileRoute('/_authenticated/head-directorates/')({
  component: HeadDirectorate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'head_directorates')
    }
  },
})
