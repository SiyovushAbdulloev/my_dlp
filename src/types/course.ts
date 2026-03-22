import { type File } from '@/types/file.ts'
import { type Translatable } from '@/types/translatable.ts'

export interface Course {
  id: string
  title: Translatable
  description?: Translatable | null
  cover?: File
  difficulty: CourseDifficulty
  duration_minutes?: number | null
  status: CourseStatus
  created_at: string
}

export type CourseDifficulty = 1 | 2 | 3

export const CourseDifficultyLabel = {
  1: 'Начинающий',
  2: 'Средний',
  3: 'Продвинутый',
}

export type CourseStatus = 1 | 2

export const CourseStatusLabel = {
  1: 'Черновик',
  2: 'Опубликован',
}
