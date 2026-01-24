import { createFileRoute } from '@tanstack/react-router'
import { CitiesCreate } from '@/features/dictionaries/cities/create.tsx'

export const Route = createFileRoute('/_authenticated/dictionaries/cities/create')({
  component: CitiesCreate,
})
