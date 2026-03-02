import { createFileRoute } from '@tanstack/react-router'
import { EducationDepartmentCreate } from '@/features/education-departments/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/education-departments/create'
)({
  component: EducationDepartmentCreate,
})
