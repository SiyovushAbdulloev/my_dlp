import { type HeadDirectorate } from '@/types/head_directorate.ts'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type HeadDirectorateForm } from '@/features/head-directorate/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<HeadDirectorate>> => {
  const json: LaravelPaginatedResource<HeadDirectorate> = await client
    .get(`head-directorates?page=${page}`)
    .json()
  return json
}

export const create = async (data: HeadDirectorateForm) => {
  const json: JsonResponse<HeadDirectorate> = await client
    .post('head-directorates', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<HeadDirectorate> = await client
    .get(`head-directorates/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: HeadDirectorateForm) => {
  const json: JsonResponse<HeadDirectorate> = await client
    .put(`head-directorates/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json: JsonResponse<{ message: string }> = await client
    .delete(`head-directorates/${id}`)
    .json()
  return json
}
