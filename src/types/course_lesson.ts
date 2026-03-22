import { type File } from '@/types/file.ts'
import { type Translatable } from '@/types/translatable.ts'

export interface CourseLesson {
  id: string
  module_id: string
  title: Translatable
  description?: Translatable | null
  sort_order: number
  duration_minutes?: number | null

  text_content?: Translatable | null
  video?: File
  video_link?: string | null
  video_description?: Translatable | null

  files?: File[]
}
