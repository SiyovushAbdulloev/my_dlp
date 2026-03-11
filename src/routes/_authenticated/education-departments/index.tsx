import { createFileRoute } from '@tanstack/react-router'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { EducationDepartments } from '@/features/education-departments'

export const Route = createFileRoute('/_authenticated/education-departments/')({
  component: EducationDepartments,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'education_departments')
    }
  },
})
