export interface Teacher {
  id: string
  full_name: string
  birthday: string
  degree: string
  university: string
  specialization: string
  category: TeacherCategory
  subject_ids: Array<string>
  class_ids: Array<string>
  phone: string
  email: string
  avatar_url: string
}

export interface TeacherCategory {
  label: string
  value: string
}