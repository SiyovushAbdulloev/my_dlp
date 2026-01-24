import { createFileRoute } from '@tanstack/react-router'
import { Cities } from '@/features/dictionaries/cities'

export const Route = createFileRoute('/_authenticated/dictionaries/cities/')({
  component: Cities,
})
