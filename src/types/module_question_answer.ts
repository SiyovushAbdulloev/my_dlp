import { type Translatable } from '@/types/translatable.ts'

export interface ModuleQuestionAnswer {
  id: string
  question_id: string
  text: Translatable
  is_correct: boolean
  sort_order: number
}
