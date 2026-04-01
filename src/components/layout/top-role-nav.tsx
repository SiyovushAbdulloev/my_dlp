import { Link, useRouterState } from '@tanstack/react-router'
import { getHorizontalNav } from '@/routes/_authenticated/lib/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

export function TopRoleNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const {
    auth: { user },
  } = useAuthStore()

  const items = getHorizontalNav(user)

  if (!items.length) return null

  const isActive = (to?: string) => {
    if (!to) return false
    return to === '/' ? pathname === '/' : pathname.startsWith(to)
  }

  return (
    <div className='mx-auto flex max-w-[1600px] items-center gap-2 px-6 py-3'>
      {items.map((item) => {
        const Icon = item.icon
        const active = isActive(item.to)

        return (
          <Link
            key={item.id}
            to={item.to!}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition',
              active
                ? 'bg-indigo-50 font-medium text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            {Icon ? <Icon className='size-4' /> : null}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
