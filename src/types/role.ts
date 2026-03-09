export interface Role {
  id: string
  name: string
  description: string
  is_systemic: boolean
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  parent?: Permission
  parent_id?: string
  children?: Permission[]
}

export const DefaultRoles = {
  SUPER_ADMIN: 'super-admin',
  REGION_ADMIN: 'regional-admin',
  DISTRICT_ADMIN: 'district-admin',
  CITY_ADMIN: 'city-admin',
  SCHOOL_ADMIN: 'school-admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  CONTENT_EDITOR: 'Методист',
}
