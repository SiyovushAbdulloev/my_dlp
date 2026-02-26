import { type SchoolClass } from '@/types/school_class.ts'
import { type Subject } from '@/types/subject.ts'

export interface VideoLesson {
  id: string
  title_ru: string
  title_tg: string
  title_en: string
  class_id: string
  class?: SchoolClass
  subject_id: string
  subject?: Subject
  video_url: string
  external_url: string
}