import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { Books } from '@/features/books'

export const Route = createFileRoute('/_authenticated/books/')({
  component: Books,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'libraries')
    }
  },
})
