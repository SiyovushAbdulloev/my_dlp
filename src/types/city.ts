import { type District } from '@/types/district.ts'

export interface City {
  id: string
  name_ru: string
  name_tj: string
  name_en: string
  district: District
  type: string
}

export type CityType = 0 | 1 | 2

export const CityTypeLabel = {
  '0': 'Город',
  '1': 'Поселок городского типа',
  '2': 'Село',
}
