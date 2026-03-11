import { useMemo } from 'react'
import { NAV, type NavItem } from '@/routes/_authenticated/components/menu.tsx'
import { type User } from '@/types/user.ts'
import { useAuthStore } from '@/stores/auth-store.ts'
import { ability } from '@/lib/casl/ability.ts'

const filterNav = (items: NavItem[], user: User): NavItem[] => {
  return items
    .filter((item) => {
      if (!item.access) {
        return true
      }
      let can = true
      item.access.forEach((item) => {
        if (!ability.can(item.action, item.subject)) {
          can = false
        }
      })
      return can
    })
    .map((item) => {
      const i = { ...item }
      i.children = filterNav(item.children ?? [], user)
      return i
    })
}

export const useNav = () => {
  const user = useAuthStore((s) => s.auth.user)

  return useMemo(() => {
    if (user) {
      return filterNav(NAV, user)
    }

    return []
  }, [user])
}
