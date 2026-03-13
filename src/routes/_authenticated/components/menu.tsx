export type NavItem = {
  id: string
  label: string
  to?: string
  access?: {
    subject: string
    action: string
  }[]
  children?: NavItem[]
}

export const NAV: NavItem[] = [
  { id: 'home', label: 'Асоси', to: '/' },

  {
    id: 'dictionaries',
    label: 'Справочники',
    to: undefined,
    children: [
      {
        id: 'regions',
        label: 'Регионы',
        to: '/dictionaries/regions',
        access: [
          {
            action: 'list',
            subject: 'regions',
          },
        ],
      },
      {
        id: 'districts',
        label: 'Районы',
        to: '/dictionaries/districts',
        access: [
          {
            action: 'list',
            subject: 'districts',
          },
        ],
      },
      {
        id: 'cities',
        label: 'Города',
        to: '/dictionaries/cities',
        access: [
          {
            action: 'list',
            subject: 'cities',
          },
        ],
      },
    ],
  },

  {
    id: 'roles_permissions',
    label: 'Роли и права',
    to: '/roles',
    access: [
      {
        action: 'list',
        subject: 'roles',
      },
    ],
  },
  {
    id: 'schools',
    label: 'Школы',
    to: '/schools',
    access: [
      {
        action: 'list',
        subject: 'schools',
      },
    ],
  },
  {
    id: 'classes',
    label: 'Классы',
    to: '/classes',
    access: [
      {
        action: 'list',
        subject: 'school_classes',
      },
    ],
  },
  {
    id: 'subjects',
    label: 'Предметы',
    to: '/subjects',
    access: [
      {
        action: 'list',
        subject: 'subjects',
      },
    ],
  },
  {
    id: 'subject-class',
    label: 'Предметы-Классы',
    to: '/subject-class',
    access: [
      {
        action: 'list',
        subject: 'subject_class',
      },
    ],
  },
  {
    id: 'webinars',
    label: 'Вебинары',
    to: '/webinars',
    access: [
      {
        action: 'list',
        subject: 'webinars',
      },
    ],
  },
  {
    id: 'video-lessons',
    label: 'Видео-уроки',
    to: '/video-lessons',
    access: [
      {
        action: 'list',
        subject: 'video-lessons',
      },
    ],
  },
  {
    id: 'teachers',
    label: 'Учителя',
    to: '/teachers',
    access: [
      {
        action: 'list',
        subject: 'teachers',
      },
    ],
  },
  {
    id: 'students',
    label: 'Ученики',
    to: '/students',
    access: [
      {
        action: 'list',
        subject: 'students',
      },
    ],
  },
  {
    id: 'lesson-topics',
    label: 'Темы уроков',
    to: '/lesson-topics',
    access: [
      {
        action: 'list',
        subject: 'lesson_topics',
      },
    ],
  },
  {
    id: 'books',
    label: 'Электронные и аудио книги',
    to: '/books',
    access: [
      {
        action: 'list',
        subject: 'books',
      },
    ],
  },
  {
    id: 'teacher-courses',
    label: 'Курсы повышения квалификации',
    to: '/teacher-courses',
    access: [
      {
        action: 'list',
        subject: 'teacher-courses',
      },
    ],
  },
  {
    id: 'education-departments',
    label: 'Шуъбахои маориф',
    to: '/education-departments',
    access: [
      {
        action: 'list',
        subject: 'education_departments',
      },
    ],
  },
  {
    id: 'head-directorates',
    label: 'Сарраёсатхо',
    to: '/head-directorates',
    access: [
      {
        action: 'list',
        subject: 'head_directorates',
      },
    ],
  },
  {
    id: 'users',
    label: 'Пользователи',
    to: '/users',
    access: [
      {
        action: 'list',
        subject: 'users',
      },
    ],
  },
]
