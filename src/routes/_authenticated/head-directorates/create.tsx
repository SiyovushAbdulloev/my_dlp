import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { HeadDirectoratesCreate } from '@/features/head-directorate/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/head-directorates/create'
)({
  component: HeadDirectoratesCreate,
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'head_directorates')
    }
  },
})
