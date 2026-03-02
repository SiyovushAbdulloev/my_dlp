import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    if (!context.auth.auth.user) {
      throw redirect({
        to: '/sign-in',
        // from: location.pathname,
      })
    }
  },
})
