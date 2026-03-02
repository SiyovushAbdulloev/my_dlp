import { createFileRoute } from '@tanstack/react-router'
import { getById, fetchPermissions } from '@/api/roles'
import { RolesEdit } from '@/features/roles/edit.tsx'

export const Route = createFileRoute('/_authenticated/roles/$roleId/edit')({
  beforeLoad: async ({ params }) => {
    const { roleId } = params
    const role = await getById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }

    const permissions = await fetchPermissions()
    return {
      permissions,
      role,
    }
  },
  component: RolesEdit,
})
