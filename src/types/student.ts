import { type SchoolClass } from '@/types/school_class.ts'

export interface Student {
  id: string
  full_name: string
  birthday: string
  class_id: string
  class?: SchoolClass
  phone: string
  email: string
  avatar_url: string
}