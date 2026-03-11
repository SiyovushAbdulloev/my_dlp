import { type JsonResponse } from '@/types/json-response.ts'
import { type SchoolClass } from '@/types/school_class.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type ClassForm } from '@/features/classes/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<SchoolClass>> => {
  const json: LaravelPaginatedResource<SchoolClass> = await client
    .get(`school-classes?page=${page}`)
    .json()
  return json
}

export const create = async (data: ClassForm) => {
  const json: JsonResponse<SchoolClass> = await client
    .post('school-classes', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<SchoolClass> = await client
    .get(`school-classes/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: ClassForm) => {
  const json: JsonResponse<SchoolClass> = await client
    .put(`school-classes/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`school-classes/${id}`).json()
  return json
}

export const fetchAll = async () => {
  const json: LaravelPaginatedResource<SchoolClass> = await client
    .get('school-classes/all')
    .json()
  return json
}
