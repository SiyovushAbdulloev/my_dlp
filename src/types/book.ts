import { type File } from '@/types/file.ts'
import { type Translatable } from '@/types/translatable.ts'

export interface Book {
  id: string
  title: Translatable
  cover: File
  book: File
  type: BookType
  is_published: number
}

export type BookType = 1 | 2

export const BookTypeLabel = {
  1: 'Книга',
  2: 'Аудиокнига',
}
