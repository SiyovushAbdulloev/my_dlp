import { createFileRoute } from '@tanstack/react-router'
import { Regions } from '@/features/dictionaries/regions'

export const Route = createFileRoute('/_authenticated/dictionaries/regions/')({
  component: Regions,
})
