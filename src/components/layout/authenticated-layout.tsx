import { Link, Outlet } from '@tanstack/react-router';
import { getCookie } from '@/lib/cookies';
import { cn } from '@/lib/utils';
import { LayoutProvider } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu.tsx'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from '@/components/config-drawer.tsx'
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Header } from '@/components/layout/header.tsx';
import { ProfileDropdown } from '@/components/profile-dropdown.tsx';
import { Search } from '@/components/search.tsx';
import { SkipToMain } from '@/components/skip-to-main';
import { ThemeSwitch } from '@/components/theme-switch.tsx';
import { useIsMobile } from '@/hooks/use-mobile.tsx'
import { useNav } from '@/routes/_authenticated/lib/useNav.ts'
import { type NavItem } from '@/routes/_authenticated/components/menu.tsx'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const isMobile = useIsMobile()
  const navItems = useNav()

  return (
    <SearchProvider>
      <LayoutProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <SidebarInset
            className={cn(
              // Set content container, so we can use container queries
              '@container/content',

              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-data-[layout=fixed]:h-svh',

              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
            )}
          >
            <Header>
              {/*<TopNav links={topNav} />*/}
              <NavigationMenu viewport={isMobile}>
                <NavigationMenuList className="flex-wrap">
                  {navItems.map((navItem: NavItem) => (
                    <NavigationMenuItem
                      className="hidden md:block"
                      key={navItem.id}
                    >
                      <NavigationMenuTrigger>
                        {navItem.children?.length ? (navItem.label) : (
                          <Link to={navItem.to}>{navItem.label}</Link>
                        )}
                      </NavigationMenuTrigger>
                      {navItem.children?.length ? (
                        <NavigationMenuContent>
                          <ul className="grid w-[300px] gap-4">
                            {navItem.children.map((child) => (
                              <li key={child.id}>
                                <NavigationMenuLink asChild>
                                  <Link to={child.to}>
                                    <div className="font-medium">{child.label}</div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      ) : null}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
              <div className='ms-auto flex items-center space-x-4'>
                <Search />
                <ThemeSwitch />
                <ConfigDrawer />
                <ProfileDropdown />
              </div>
            </Header>
            {children ?? <Outlet />}
          </SidebarInset>
        </SidebarProvider>
      </LayoutProvider>
    </SearchProvider>
  )
}
