import { type Region } from '@/types/region.ts'

export interface District {
  id: string
  name_ru: string
  name_tg: string
  name_en: string
  region: Region
}