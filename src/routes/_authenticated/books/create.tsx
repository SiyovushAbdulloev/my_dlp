import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { BooksCreate } from '@/features/books/create.tsx'

export const Route = createFileRoute('/_authenticated/books/create')({
  component: BooksCreate,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'libraries')
    }
  },
})
