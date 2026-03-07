import { type District } from '@/types/district.ts'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type DistrictForm } from '@/features/dictionaries/districts/create.tsx'

export const fetchIndex = async (
  page: number,
  q?: string
): Promise<LaravelPaginatedResource<District>> => {
  const json: LaravelPaginatedResource<District> = await client
    .get(`districts?page=${page}&q=${q ?? ''}`)
    .json()
  return json
}

export const create = async (data: DistrictForm) => {
  const json: District = await client
    .post('districts', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<District> = await client
    .get(`districts/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: DistrictForm) => {
  const json: JsonResponse<District> = await client
    .put(`districts/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`districts/${id}`).json()
  return json
}
