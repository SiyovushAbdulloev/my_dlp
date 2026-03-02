import { createFileRoute } from '@tanstack/react-router'
import { EducationDepartments } from '@/features/education-departments'

export const Route = createFileRoute('/_authenticated/education-departments/')({
  component: EducationDepartments,
})
