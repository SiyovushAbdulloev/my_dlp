import { type Role } from '@/types/role.ts'

export interface User {
  id: string
  login: string
  phone: string
  email: string
  first_name: string
  last_name: string
  middle_name: string
  birthdate: string
  gender: Gender
  school_id: string
  avatar: string
  role: Role
  is_disabled: boolean
}

export type Gender = 'm' | 'f'

export const GenderLabel = {
  m: 'Мужчина',
  f: 'Женщина',
}