import { Outlet } from '@tanstack/react-router'
import { isLearningRole } from '@/routes/_authenticated/lib/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { LayoutProvider } from '@/context/layout-provider'
import { SearchProvider } from '@/context/search-provider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { TopRoleNav } from '@/components/layout/top-role-nav'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const {
    auth: { user },
  } = useAuthStore()

  const learningRole = isLearningRole(user)

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />

          {!learningRole ? <AppSidebar /> : null}

          <SidebarInset
            className={cn(
              '@container/content',
              'min-h-svh',
              'bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30'
            )}
          >
            <Header bottomSlot={learningRole ? <TopRoleNav /> : null} />

            <main
              className={cn(
                'w-full',
                learningRole ? 'mx-auto max-w-[1400px] px-6 py-6' : 'px-6 py-6'
              )}
            >
              {children ?? <Outlet />}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
