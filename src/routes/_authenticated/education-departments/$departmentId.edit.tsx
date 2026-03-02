import { createFileRoute } from '@tanstack/react-router'
import { getById } from '@/api/education-departments'
import { EducationDepartmentsEdit } from '@/features/education-departments/edit.tsx'

export const Route = createFileRoute(
  '/_authenticated/education-departments/$departmentId/edit'
)({
  beforeLoad: async ({ params }) => {
    const { departmentId } = params
    const department = await getById(departmentId)
    if (!department) {
      throw new Error('Region not found')
    }

    return {
      department,
    }
  },
  component: EducationDepartmentsEdit,
})
