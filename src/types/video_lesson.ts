import { type File } from '@/types/file.ts'
import { type SchoolClass } from '@/types/school_class'
import { type Subject } from '@/types/subject'
import { type Translatable } from '@/types/translatable.ts'

export interface VideoLesson {
  id: string
  title: Translatable
  is_published: boolean
  class_id: string
  schoolClass?: SchoolClass
  subject_id?: string
  subject?: Subject
  link?: string | null
  video?: File | null
  cover?: File | null
}
