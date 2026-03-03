import { createFileRoute, redirect } from '@tanstack/react-router'
import { getUser } from '@/api/auth'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    const auth = context.auth.auth

    if (auth.user) return

    try {
      const me = await getUser()

      auth.setUser(me.data)
    } catch {
      throw redirect({ to: '/sign-in' })
    }
  },
})
