import { createFileRoute } from '@tanstack/react-router'
import { Districts } from '@/features/dictionaries/districts'

export const Route = createFileRoute('/_authenticated/dictionaries/districts/')({
  component: Districts,
})
