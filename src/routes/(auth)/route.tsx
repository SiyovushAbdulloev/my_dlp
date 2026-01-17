import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
  beforeLoad: ({context, location}) => {
    if (context.auth.auth.user) {
      throw redirect({
        to: '/',
        from: location.pathname
      })
    }
  },
})

type Props = {
  children?: React.ReactNode
}

function RouteComponent({ children }: Props) {
  return (
    <>
      {children ?? <Outlet />}
    </>
  )
}
