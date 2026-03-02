import { type District } from '@/types/district.ts'

export interface City {
  id: string
  name_ru: string
  name_tg: string
  name_en: string
  district: District
  type: CityType
}

export type CityType = 'city' | 'town' | 'village'

export const CityTypeLabel = {
  city: 'Город',
  town: 'Городок',
  village: 'Село',
}
