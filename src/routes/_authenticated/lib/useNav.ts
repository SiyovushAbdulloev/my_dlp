import { useMemo } from 'react'
import { NAV, type NavItem } from '@/routes/_authenticated/components/menu.tsx'
import { useAuthStore } from '@/stores/auth-store.ts'
import { type User } from '@/types/user.ts'

const filterNav = (items: NavItem[], user: User): NavItem[] => {
  return items
    .filter(
      (item) => item.access?.length && item.access.includes(user.role.name)
    )
    .map((item) => {
      const i = { ...item }
      i.children = filterNav(item.children ?? [], user)
      return i
    })
}

export const useNav = () => {
  const {
    auth: { user },
  } = useAuthStore()

  return useMemo(() => {
    if (user) {
      return filterNav(NAV, user)
    }

    return []
  }, [user])
}