import { redirect } from '@tanstack/react-router'
import { ability } from '@/lib/casl/ability.ts'

export function beforeLoadRoute(
  action: string,
  subject: string,
  url = '/403'
): undefined {
  if (!ability.can(action, subject)) {
    throw redirect({ to: url })
  }
}
