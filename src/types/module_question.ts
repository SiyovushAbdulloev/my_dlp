import { type Translatable } from '@/types/translatable.ts'

export interface ModuleQuestion {
  id: string
  module_id: string
  text: Translatable
  type: ModuleQuestionType
  sort_order: number
}

export type ModuleQuestionType = 1 | 2 | 3

export const ModuleQuestionTypeLabel = {
  1: 'Одиночный',
  2: 'Множественный',
  3: 'Правда/Лож',
}
