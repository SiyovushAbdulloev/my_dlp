import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/roles'
import { UsersCreate } from '@/features/users/create.tsx'

export const Route = createFileRoute('/_authenticated/users/create')({
  beforeLoad: async () => {
    const roles = await fetchAll()
    return {
      roles,
    }
  },
  component: UsersCreate,
})
