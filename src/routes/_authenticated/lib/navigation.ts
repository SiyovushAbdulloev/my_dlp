import { type User } from '@/types/user'
import {
  BookOpen,
  Building2,
  FolderTree,
  GraduationCap,
  Home,
  Library,
  MapPinned,
  PlayCircle,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { ability } from '@/lib/casl/ability'

export type AppNavItem = {
  id: string
  label: string
  to?: string
  icon?: React.ElementType
  children?: AppNavItem[]
}

const can = (action: string, subject: string) =>
  ability.can(action as never, subject as never)

export function isLearningRole(user?: User | null) {
  const role = user?.role?.name
  return role === 'student' || role === 'teacher'
}

export function getSidebarNav(user?: User | null): AppNavItem[] {
  if (!user || isLearningRole(user)) return []

  const items: AppNavItem[] = [
    { id: 'home', label: 'Асоси', to: '/', icon: Home },

    {
      id: 'dictionaries',
      label: 'Справочники',
      icon: FolderTree,
      children: [
        can('list', 'regions')
          ? {
              id: 'regions',
              label: 'Регионы',
              to: '/dictionaries/regions',
              icon: MapPinned,
            }
          : null,
        can('list', 'districts')
          ? {
              id: 'districts',
              label: 'Районы',
              to: '/dictionaries/districts',
              icon: MapPinned,
            }
          : null,
        can('list', 'cities')
          ? {
              id: 'cities',
              label: 'Города',
              to: '/dictionaries/cities',
              icon: MapPinned,
            }
          : null,
      ].filter(Boolean) as AppNavItem[],
    },

    can('list', 'roles')
      ? { id: 'roles', label: 'Роли и права', to: '/roles', icon: ShieldCheck }
      : null,

    can('list', 'users')
      ? { id: 'users', label: 'Пользователи', to: '/users', icon: Users }
      : null,

    can('list', 'school_classes')
      ? { id: 'classes', label: 'Классы', to: '/classes', icon: GraduationCap }
      : null,

    can('list', 'subjects')
      ? { id: 'subjects', label: 'Предметы', to: '/subjects', icon: BookOpen }
      : null,

    can('list', 'subject_class')
      ? {
          id: 'subject-class',
          label: 'Предметы-Классы',
          to: '/subject-class',
          icon: FolderTree,
        }
      : null,

    can('list', 'video_lessons')
      ? {
          id: 'video-lessons',
          label: 'Видео-уроки',
          to: '/video-lessons',
          icon: PlayCircle,
        }
      : null,

    can('list', 'lesson_topics')
      ? {
          id: 'lesson-topics',
          label: 'Темы уроков',
          to: '/lesson-topics',
          icon: BookOpen,
        }
      : null,

    can('list', 'libraries')
      ? {
          id: 'books',
          label: 'Электронные и аудио книги',
          to: '/books',
          icon: Library,
        }
      : null,

    can('list', 'courses')
      ? { id: 'courses', label: 'Курсы', to: '/courses', icon: GraduationCap }
      : null,

    can('list', 'education_departments')
      ? {
          id: 'education-departments',
          label: 'Шуъбахои маориф',
          to: '/education-departments',
          icon: Building2,
        }
      : null,

    can('list', 'head_directorates')
      ? {
          id: 'head-directorates',
          label: 'Сарраёсатхо',
          to: '/head-directorates',
          icon: Building2,
        }
      : null,
  ].filter(Boolean) as AppNavItem[]

  return items.filter((item) => !item.children || item.children.length > 0)
}

export function getHorizontalNav(user?: User | null): AppNavItem[] {
  const role = user?.role?.name

  if (role === 'student') {
    return [
      { id: 'lessons', label: 'Дарсҳои ман', to: '/courses', icon: BookOpen },
    ]
  }

  if (role === 'teacher') {
    return [
      { id: 'home', label: 'Асосӣ', to: '/', icon: Home },
      { id: 'courses', label: 'Курсҳо', to: '/courses', icon: GraduationCap },
    ]
  }

  return []
}
