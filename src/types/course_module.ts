import { type Translatable } from '@/types/translatable.ts'

export interface CourseModule {
  id: string
  course_id: string
  title: Translatable
  description?: Translatable | null
  sort_order: number
  passing_score: number
  attempts_allowed: number
  randomize_questions: boolean
}
