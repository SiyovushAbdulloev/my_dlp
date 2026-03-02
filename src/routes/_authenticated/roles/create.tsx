import { createFileRoute } from '@tanstack/react-router'
import { fetchPermissions } from '@/api/roles'
import { RolesCreate } from '@/features/roles/create.tsx'

export const Route = createFileRoute('/_authenticated/roles/create')({
  beforeLoad: async () => {
    const permissions = await fetchPermissions()
    return {
      permissions,
    }
  },
  component: RolesCreate,
})
