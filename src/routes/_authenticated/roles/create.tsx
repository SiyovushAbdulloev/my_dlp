import { createFileRoute } from '@tanstack/react-router'
import { RolesCreate } from '@/features/roles/create.tsx'
import { fetchPermissions } from '@/api/roles'

export const Route = createFileRoute('/_authenticated/roles/create')({
  beforeLoad: async () => {
    const permissions = await fetchPermissions()
    return {
      permissions,
    }
  },
  component: RolesCreate,
})
