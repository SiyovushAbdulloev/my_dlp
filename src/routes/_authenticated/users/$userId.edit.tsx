import { createFileRoute } from '@tanstack/react-router'
import { fetchAll } from '@/api/roles'
import { getById } from '@/api/users'
import { UsersEdit } from '@/features/users/edit.tsx'

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  beforeLoad: async ({ params }) => {
    const { userId } = params
    const user = await getById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const roles = await fetchAll()

    return {
      user: user.data,
      roles,
    }
  },
  component: UsersEdit,
})
