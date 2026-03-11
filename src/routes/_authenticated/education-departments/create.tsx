import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { EducationDepartmentCreate } from '@/features/education-departments/create.tsx'

export const Route = createFileRoute(
  '/_authenticated/education-departments/create'
)({
  component: EducationDepartmentCreate,
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'education_departments')
    }
  },
})
