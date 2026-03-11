import { createFileRoute } from '@tanstack/react-router'
import { fetchPermissions } from '@/api/roles'
import { beforeLoadRoute } from '@/lib/casl/routes/check.ts'
import { RolesCreate } from '@/features/roles/create.tsx'

export const Route = createFileRoute('/_authenticated/roles/create')({
  beforeLoad: async ({ context }) => {
    if (context.auth.auth.user) {
      beforeLoadRoute('create', 'roles')
    }
    const permissions = await fetchPermissions()
    return {
      permissions,
    }
  },
  component: RolesCreate,
})
