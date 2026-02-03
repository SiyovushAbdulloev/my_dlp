import { DefaultRoles } from '@/types'

export type NavItem = {
  id: string
  label: string
  to?: string
  access?: string[]
  children?: NavItem[]
}

export const NAV: NavItem[] = [
  { id: 'home', label: 'Асоси', to: '/' },

  {
    id: 'dictionaries',
    label: 'Справочники',
    to: undefined,
    access: [DefaultRoles.SUPER_ADMIN],
    children: [
      { id: 'regions', label: 'Регионы', to: '/dictionaries/regions', access: [DefaultRoles.SUPER_ADMIN] },
      { id: 'districts', label: 'Районы', to: '/dictionaries/districts', access: [DefaultRoles.SUPER_ADMIN] },
      { id: 'cities', label: 'Города', to: '/dictionaries/cities', access: [DefaultRoles.SUPER_ADMIN] },
    ]
  },

  { id: 'roles_permissions', label: 'Роли и права', to: '/roles', access: [DefaultRoles.SUPER_ADMIN] },
  { id: 'users', label: 'Пользователи', to: '/users', access: [DefaultRoles.SUPER_ADMIN] },
  { id: 'schools', label: 'Школы', to: '/schools', access: [DefaultRoles.DISTRICT_ADMIN] },
  { id: 'classes', label: 'Классы', to: '/classes', access: [DefaultRoles.DISTRICT_ADMIN] },
]
