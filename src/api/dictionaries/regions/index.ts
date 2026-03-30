import { type Region } from '@/types'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type RegionForm } from '@/features/dictionaries/regions/create.tsx'

export const fetchIndex = async (
  page: number,
  q?: string
): Promise<LaravelPaginatedResource<Region>> => {
  const json: LaravelPaginatedResource<Region> = await client
    .get(`regions?page=${page}&q=${q ?? ''}`)
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

export const fetchAll = async () => {
  const json: JsonResponse<Region[]> = await client.get('regions/all').json()
  return json
}
