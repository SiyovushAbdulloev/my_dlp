import { type City } from '@/types/city.ts'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type CityForm } from '@/features/dictionaries/cities/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<City>> => {
  const json: LaravelPaginatedResource<City> = await client
    .get(`cities?page=${page}`)
    .json()
  return json
}

export const create = async (data: CityForm) => {
  const json: City = await client
    .post('cities', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<City> = await client.get(`cities/${id}`).json()
  return json
}

export const edit = async (id: string, data: CityForm) => {
  const json: JsonResponse<City> = await client
    .put(`cities/${id}`, {
      method: 'PUT',
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`cities/${id}`).json()
  return json
}
