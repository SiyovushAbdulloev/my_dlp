import { type SchoolClass } from '@/types/school_class.ts'
import { type Subject } from '@/types/subject.ts'

export interface LessonTopic {
  id: string
  class_id: string
  class?: SchoolClass
  subject_id: string
  subject?: Subject
  topic: string
  content: string
}