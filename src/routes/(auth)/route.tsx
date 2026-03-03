import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getUser } from '@/api/auth'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const auth = context.auth.auth

    if (auth.user) return

    try {
      const me = await getUser()

      auth.setUser(me.data)
    } catch (e) {
      console.log(e)
      return
    }

    throw redirect({ to: '/' })
  },
})

type Props = {
  children?: React.ReactNode
}

function RouteComponent({ children }: Props) {
  return <>{children ?? <Outlet />}</>
}
