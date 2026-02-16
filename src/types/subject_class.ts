import { type SchoolClass } from '@/types/school_class.ts'
import { type Subject } from '@/types/subject.ts'

export interface SubjectClass {
  id: string
  subject_id: string
  subject?: Subject
  class_id: string
  class?: SchoolClass
}