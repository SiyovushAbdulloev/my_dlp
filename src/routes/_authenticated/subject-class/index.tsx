import { createFileRoute } from '@tanstack/react-router'
import { SubjectClass } from '@/features/subject-class'

export const Route = createFileRoute('/_authenticated/subject-class/')({
  component: SubjectClass,
})
