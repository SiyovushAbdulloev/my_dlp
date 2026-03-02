import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/books'
import { BooksEdit } from '@/features/books/edit.tsx'

export const Route = createFileRoute('/_authenticated/books/$bookId/edit')({
  beforeLoad: async ({ params }) => {
    const { bookId } = params
    const book = await getById(bookId)
    if (!book) {
      throw new Error('Book not found')
    }

    return {
      book,
    }
  },
  component: BooksEdit,
})
