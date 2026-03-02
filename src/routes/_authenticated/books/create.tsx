import { createFileRoute } from '@tanstack/react-router'
import { BooksCreate } from '@/features/books/create.tsx'

export const Route = createFileRoute('/_authenticated/books/create')({
  component: BooksCreate,
})
