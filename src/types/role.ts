export interface Role {
  id: string
  name: string
  is_static: boolean
  permissions?: Permission[]
}

export interface Permission {
  id: string
  name: string
  description: string
  parent?: Permission
  children?: Permission[]
}

export const DefaultRoles = {
  SUPER_ADMIN: 'Министерство',
  REGION_ADMIN: 'Регион',
  DISTRICT_ADMIN: 'Район',
  CITY_ADMIN: 'Город',
  SCHOOL_ADMIN: 'Школа',
  TEACHER: 'Учитель',
  STUDENT: 'Ученик',
  CONTENT_EDITOR: 'Методист',
}