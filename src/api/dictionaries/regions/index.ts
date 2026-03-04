import { type Region } from '@/types'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { sleep } from '@/lib/utils.ts'
import { type RegionForm } from '@/features/dictionaries/regions/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Region>> => {
  const json: LaravelPaginatedResource<Region> = await client
    .get(`regions?page=${page}`)
    .json()
  return json
}

export const create = async (data: RegionForm) => {
  const json: JsonResponse<Region> = await client
    .post('regions', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<Region> = await client.get(`regions/${id}`).json()
  return json
}

export const edit = async (id: string, data: RegionForm) => {
  const json: JsonResponse<Region> = await client
    .put(`regions/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`regions/${id}`).json()
  return json
}

export const fetchAll = async (): Promise<{ data: Region[] }> => {
  // const json: LaravelPaginatedResource<Region> = await client.get(import.meta.env.API_URL + '/api/dictionaries/regions').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tj: `Вилояти №${index + 1}`,
      name_ru: `Область №${index + 1}`,
      name_en: `Region №${index + 1}`,
    })),
  }
}
