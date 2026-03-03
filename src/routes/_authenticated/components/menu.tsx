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
      {
        id: 'regions',
        label: 'Регионы',
        to: '/dictionaries/regions',
        access: [DefaultRoles.SUPER_ADMIN],
      },
      {
        id: 'districts',
        label: 'Районы',
        to: '/dictionaries/districts',
        access: [DefaultRoles.SUPER_ADMIN],
      },
      {
        id: 'cities',
        label: 'Города',
        to: '/dictionaries/cities',
        access: [DefaultRoles.SUPER_ADMIN],
      },
    ],
  },

  {
    id: 'roles_permissions',
    label: 'Роли и права',
    to: '/roles',
    access: [DefaultRoles.SUPER_ADMIN],
  },
  {
    id: 'schools',
    label: 'Школы',
    to: '/schools',
    access: [DefaultRoles.DISTRICT_ADMIN],
  },
  {
    id: 'classes',
    label: 'Классы',
    to: '/classes',
    access: [DefaultRoles.SCHOOL_ADMIN, DefaultRoles.DISTRICT_ADMIN],
  },
  {
    id: 'subjects',
    label: 'Предметы',
    to: '/subjects',
    access: [DefaultRoles.SCHOOL_ADMIN, DefaultRoles.DISTRICT_ADMIN],
  },
  {
    id: 'subject-class',
    label: 'Предметы-Классы',
    to: '/subject-class',
    access: [DefaultRoles.DISTRICT_ADMIN],
  },
  {
    id: 'webinars',
    label: 'Вебинары',
    to: '/webinars',
    access: [
      DefaultRoles.STUDENT,
      DefaultRoles.TEACHER,
      DefaultRoles.SCHOOL_ADMIN,
      DefaultRoles.DISTRICT_ADMIN,
      DefaultRoles.REGION_ADMIN,
    ],
  },
  {
    id: 'video-lessons',
    label: 'Видео-уроки',
    to: '/video-lessons',
    access: [
      DefaultRoles.STUDENT,
      DefaultRoles.TEACHER,
      DefaultRoles.SCHOOL_ADMIN,
      DefaultRoles.DISTRICT_ADMIN,
      DefaultRoles.REGION_ADMIN,
    ],
  },
  {
    id: 'teachers',
    label: 'Учителя',
    to: '/teachers',
    access: [DefaultRoles.SCHOOL_ADMIN],
  },
  {
    id: 'students',
    label: 'Ученики',
    to: '/students',
    access: [DefaultRoles.SCHOOL_ADMIN],
  },
  {
    id: 'lesson-topics',
    label: 'Темы уроков',
    to: '/lesson-topics',
    access: [DefaultRoles.TEACHER, DefaultRoles.SCHOOL_ADMIN],
  },
  {
    id: 'books',
    label: 'Электронные и аудио книги',
    to: '/books',
    access: [
      DefaultRoles.STUDENT,
      DefaultRoles.TEACHER,
      DefaultRoles.SCHOOL_ADMIN,
      DefaultRoles.DISTRICT_ADMIN,
      DefaultRoles.REGION_ADMIN,
      DefaultRoles.SUPER_ADMIN,
    ],
  },
  {
    id: 'teacher-courses',
    label: 'Курсы повышения квалификации',
    to: '/teacher-courses',
    access: [
      DefaultRoles.TEACHER,
      DefaultRoles.SCHOOL_ADMIN,
      DefaultRoles.DISTRICT_ADMIN,
    ],
  },
  {
    id: 'education-departments',
    label: 'Шуъбахои маориф',
    to: '/education-departments',
    access: [DefaultRoles.REGION_ADMIN],
  },
  {
    id: 'head-directorates',
    label: 'Сарраёсатхо',
    to: '/head-directorates',
    access: [DefaultRoles.SUPER_ADMIN],
  },
  {
    id: 'users',
    label: 'Пользователи',
    to: '/users',
    access: [DefaultRoles.SUPER_ADMIN],
  },
]
