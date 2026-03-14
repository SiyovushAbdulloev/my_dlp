import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/books'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { BookShow } from '@/features/books/show'

export const Route = createFileRoute('/_authenticated/books/$bookId/show')({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('view', 'libraries')
    }
    const { bookId } = params
    const book = await getById(bookId)
    if (!book) throw new Error('Book not found')
    return { book: book.data }
  },
  component: BookShow,
})
