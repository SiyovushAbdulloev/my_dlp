import { createFileRoute } from '@tanstack/react-router'
import { getById, fetchPermissions } from '@/api/roles'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { RolesEdit } from '@/features/roles/edit.tsx'

export const Route = createFileRoute('/_authenticated/roles/$roleId/edit')({
  beforeLoad: async ({ context, params }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('edit', 'roles')
    }
    const { roleId } = params
    const role = await getById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }

    const permissions = await fetchPermissions()
    return {
      permissions,
      role: role.data,
    }
  },
  component: RolesEdit,
})
