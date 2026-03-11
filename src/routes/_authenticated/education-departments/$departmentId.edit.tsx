import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/education-departments'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { EducationDepartmentsEdit } from '@/features/education-departments/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/education-departments/$departmentId/edit'
)({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'education_departments')
    }
    const { departmentId } = params
    const department = await getById(departmentId)
    if (!department) {
      throw new Error('Region not found')
    }

    return {
      department: department.data,
    }
  },
  component: EducationDepartmentsEdit,
})
