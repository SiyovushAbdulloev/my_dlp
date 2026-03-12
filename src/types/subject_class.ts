import { type SchoolClass } from '@/types/school_class.ts'
import { type Subject } from '@/types/subject.ts'

export interface Item {
  class: SchoolClass
  subject: Subject
}

export interface SubjectClass {
  id: string
  items: Item[]
}
