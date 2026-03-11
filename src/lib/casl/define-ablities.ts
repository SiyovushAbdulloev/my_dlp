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

  return build()
}
