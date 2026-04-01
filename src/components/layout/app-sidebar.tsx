import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { getSidebarNav } from '@/routes/_authenticated/lib/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const {
    auth: { user },
  } = useAuthStore()

  const items = getSidebarNav(user)
  const [opened, setOpened] = useState<string[]>(['dictionaries'])

  const isOpen = (id: string) => opened.includes(id)

  const toggle = (id: string) => {
    setOpened((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const isActive = (to?: string) => {
    if (!to) return false
    return to === '/' ? pathname === '/' : pathname.startsWith(to)
  }

  const hasActiveChild = (children?: { to?: string }[]) =>
    children?.some((child) => isActive(child.to)) ?? false

  return (
    <Sidebar collapsible='icon' variant='inset'>
      <SidebarHeader className='border-b border-slate-200 px-3 py-4'>
        <div className='px-2'>
          <p className='text-sm font-semibold text-slate-900'>
            Панель управления
          </p>
          <p className='text-xs text-slate-500'>
            {user?.role?.description ?? user?.role?.name}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-3 py-4'>
        <nav className='space-y-2'>
          {items.map((item) => {
            const Icon = item.icon
            const expanded = isOpen(item.id)
            const active = isActive(item.to) || hasActiveChild(item.children)

            if (item.children?.length) {
              return (
                <div key={item.id} className='space-y-1'>
                  <button
                    type='button'
                    onClick={() => toggle(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition',
                      active
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      {Icon ? <Icon className='size-4' /> : null}
                      <span className='text-sm font-medium'>{item.label}</span>
                    </div>
                    {expanded ? (
                      <ChevronDown className='size-4' />
                    ) : (
                      <ChevronRight className='size-4' />
                    )}
                  </button>

                  {expanded ? (
                    <div className='ml-4 space-y-1 border-l border-slate-200 pl-3'>
                      {item.children.map((child) => {
                        const ChildIcon = child.icon
                        const childActive = isActive(child.to)

                        return (
                          <Link
                            key={child.id}
                            to={child.to!}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
                              childActive
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            )}
                          >
                            {ChildIcon ? (
                              <ChildIcon className='size-4' />
                            ) : null}
                            <span>{child.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            }

            return (
              <Link
                key={item.id}
                to={item.to!}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 transition',
                  active
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {Icon ? <Icon className='size-4' /> : null}
                <span className='text-sm font-medium'>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
