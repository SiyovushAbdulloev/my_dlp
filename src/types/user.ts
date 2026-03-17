import { type File } from '@/types/file.ts'
import { type Role } from '@/types/role.ts'

export interface User {
  id: string
  first_name: string
  last_name: string
  middle_name: string
  birthdate: string
  role: Role
  is_disabled: boolean
  education: string
  university: string
  profession: string
  category: string
  appointment_date: string
  phone: string
  email: string
  head_directorate_id?: string
  education_department_id?: string
  login: string
  avatar?: File
}
