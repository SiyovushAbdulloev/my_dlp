import { createFileRoute } from '@tanstack/react-router'
import { EducationDepartments } from '@/features/education-departments'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'

export const Route = createFileRoute('/_authenticated/education-departments/')({
  component: EducationDepartments,
  beforeLoad: ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('list', 'education_departments')
    }
  },
})
