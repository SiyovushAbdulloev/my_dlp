export interface Role {
  id: string
  name: string
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