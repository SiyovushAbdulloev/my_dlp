import type { User } from '@/types/user'
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

export function defineAbilitiesFor(user: User | null) {
  const { can, build } = new AbilityBuilder(createMongoAbility)
  const permissions = user?.role?.permissions

  if (!permissions || permissions.length === 0) {
    return build()
  }

  //Roles
  if (permissions.find((p) => p.name === 'roles_and_permissions_list')) {
    can('list', 'roles')
  }
  if (permissions.find((p) => p.name === 'roles_and_permissions_create')) {
    can('create', 'roles')
  }
  if (permissions.find((p) => p.name === 'roles_and_permissions_view')) {
    can('view', 'roles')
  }
  if (permissions.find((p) => p.name === 'roles_and_permissions_edit')) {
    can('edit', 'roles')
  }
  if (permissions.find((p) => p.name === 'roles_and_permissions_delete')) {
    can('delete', 'roles')
  }

  //Regions
  if (permissions.find((p) => p.name === 'regions_list')) {
    can('list', 'regions')
  }
  if (permissions.find((p) => p.name === 'regions_create')) {
    can('create', 'regions')
  }
  if (permissions.find((p) => p.name === 'regions_view')) {
    can('view', 'regions')
  }
  if (permissions.find((p) => p.name === 'regions_edit')) {
    can('edit', 'regions')
  }
  if (permissions.find((p) => p.name === 'regions_delete')) {
    can('delete', 'regions')
  }

  //Districts
  if (permissions.find((p) => p.name === 'districts_list')) {
    can('list', 'districts')
  }
  if (permissions.find((p) => p.name === 'districts_create')) {
    can('create', 'districts')
  }
  if (permissions.find((p) => p.name === 'districts_view')) {
    can('view', 'districts')
  }
  if (permissions.find((p) => p.name === 'districts_edit')) {
    can('edit', 'districts')
  }
  if (permissions.find((p) => p.name === 'districts_delete')) {
    can('delete', 'districts')
  }

  //Cities
  if (permissions.find((p) => p.name === 'cities_list')) {
    can('list', 'cities')
  }
  if (permissions.find((p) => p.name === 'cities_create')) {
    can('create', 'cities')
  }
  if (permissions.find((p) => p.name === 'cities_view')) {
    can('view', 'cities')
  }
  if (permissions.find((p) => p.name === 'cities_edit')) {
    can('edit', 'cities')
  }
  if (permissions.find((p) => p.name === 'cities_delete')) {
    can('delete', 'cities')
  }

  //Education departments
  if (permissions.find((p) => p.name === 'education_departments_list')) {
    can('list', 'education_departments')
  }
  if (permissions.find((p) => p.name === 'education_departments_create')) {
    can('create', 'education_departments')
  }
  if (permissions.find((p) => p.name === 'education_departments_view')) {
    can('view', 'education_departments')
  }
  if (permissions.find((p) => p.name === 'education_departments_edit')) {
    can('edit', 'education_departments')
  }
  if (permissions.find((p) => p.name === 'education_departments_delete')) {
    can('delete', 'education_departments')
  }

  //Head directorates
  if (permissions.find((p) => p.name === 'head_directorates_list')) {
    can('list', 'head_directorates')
  }
  if (permissions.find((p) => p.name === 'head_directorates_create')) {
    can('create', 'head_directorates')
  }
  if (permissions.find((p) => p.name === 'head_directorates_view')) {
    can('view', 'head_directorates')
  }
  if (permissions.find((p) => p.name === 'head_directorates_edit')) {
    can('edit', 'head_directorates')
  }
  if (permissions.find((p) => p.name === 'head_directorates_delete')) {
    can('delete', 'head_directorates')
  }

  //School classes
  if (permissions.find((p) => p.name === 'school_classes_list')) {
    can('list', 'school_classes')
  }
  if (permissions.find((p) => p.name === 'school_classes_create')) {
    can('create', 'school_classes')
  }
  if (permissions.find((p) => p.name === 'school_classes_view')) {
    can('view', 'school_classes')
  }
  if (permissions.find((p) => p.name === 'school_classes_edit')) {
    can('edit', 'school_classes')
  }
  if (permissions.find((p) => p.name === 'school_classes_delete')) {
    can('delete', 'school_classes')
  }

  //Subjects
  if (permissions.find((p) => p.name === 'subjects_list')) {
    can('list', 'subjects')
  }
  if (permissions.find((p) => p.name === 'subjects_create')) {
    can('create', 'subjects')
  }
  if (permissions.find((p) => p.name === 'subjects_view')) {
    can('view', 'subjects')
  }
  if (permissions.find((p) => p.name === 'subjects_edit')) {
    can('edit', 'subjects')
  }
  if (permissions.find((p) => p.name === 'subjects_delete')) {
    can('delete', 'subjects')
  }

  //Subject class
  if (permissions.find((p) => p.name === 'subject_class_list')) {
    can('list', 'subject_class')
  }
  if (permissions.find((p) => p.name === 'subject_class_create')) {
    can('create', 'subject_class')
  }
  if (permissions.find((p) => p.name === 'subject_class_view')) {
    can('view', 'subject_class')
  }
  if (permissions.find((p) => p.name === 'subject_class_edit')) {
    can('edit', 'subject_class')
  }
  if (permissions.find((p) => p.name === 'subject_class_delete')) {
    can('delete', 'subject_class')
  }

  //Lesson topics
  if (permissions.find((p) => p.name === 'lesson_topics_list')) {
    can('list', 'lesson_topics')
  }
  if (permissions.find((p) => p.name === 'lesson_topics_create')) {
    can('create', 'lesson_topics')
  }
  if (permissions.find((p) => p.name === 'lesson_topics_view')) {
    can('view', 'lesson_topics')
  }
  if (permissions.find((p) => p.name === 'lesson_topics_edit')) {
    can('edit', 'lesson_topics')
  }
  if (permissions.find((p) => p.name === 'lesson_topics_delete')) {
    can('delete', 'lesson_topics')
  }

  //Libraries
  if (permissions.find((p) => p.name === 'libraries_list')) {
    can('list', 'libraries')
  }
  if (permissions.find((p) => p.name === 'libraries_create')) {
    can('create', 'libraries')
  }
  if (permissions.find((p) => p.name === 'libraries_view')) {
    can('view', 'libraries')
  }
  if (permissions.find((p) => p.name === 'libraries_edit')) {
    can('edit', 'libraries')
  }
  if (permissions.find((p) => p.name === 'libraries_delete')) {
    can('delete', 'libraries')
  }

  //Users
  if (permissions.find((p) => p.name === 'users_list')) {
    can('list', 'users')
  }
  if (permissions.find((p) => p.name === 'users_create')) {
    can('create', 'users')
  }
  if (permissions.find((p) => p.name === 'users_view')) {
    can('view', 'users')
  }
  if (permissions.find((p) => p.name === 'users_edit')) {
    can('edit', 'users')
  }
  if (permissions.find((p) => p.name === 'users_delete')) {
    can('delete', 'users')
  }

  //Video lessons
  if (permissions.find((p) => p.name === 'video_lessons_list')) {
    can('list', 'video_lessons')
  }
  if (permissions.find((p) => p.name === 'video_lessons_create')) {
    can('create', 'video_lessons')
  }
  if (permissions.find((p) => p.name === 'video_lessons_view')) {
    can('view', 'video_lessons')
  }
  if (permissions.find((p) => p.name === 'video_lessons_edit')) {
    can('edit', 'video_lessons')
  }
  if (permissions.find((p) => p.name === 'video_lessons_delete')) {
    can('delete', 'video_lessons')
  }

  //Courses
  if (permissions.find((p) => p.name === 'courses_list')) {
    can('list', 'courses')
  }
  if (permissions.find((p) => p.name === 'courses_create')) {
    can('create', 'courses')
  }
  if (permissions.find((p) => p.name === 'courses_view')) {
    can('view', 'courses')
  }
  if (permissions.find((p) => p.name === 'courses_edit')) {
    can('edit', 'courses')
  }
  if (permissions.find((p) => p.name === 'courses_delete')) {
    can('delete', 'courses')
  }

  return build()
}
