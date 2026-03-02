import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/books'
import { BookShow } from '@/features/books/show'

export const Route = createFileRoute('/_authenticated/books/$bookId')({
  beforeLoad: async ({ params }) => {
    const { bookId } = params
    const book = await getById(bookId)
    if (!book) throw new Error('Book not found')
    return { book }
  },
  component: BookShow,
})
