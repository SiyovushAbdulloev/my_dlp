import { type JsonResponse } from '@/types/json-response.ts'
import { type Subject } from '@/types/subject.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type SubjectForm } from '@/features/subjects/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Subject>> => {
  const json: LaravelPaginatedResource<Subject> = await client
    .get(`subjects?page=${page}`)
    .json()
  return json
}

export const create = async (data: SubjectForm) => {
  const json: JsonResponse<Subject> = await client
    .post('subjects', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<Subject> = await client.get(`subjects/${id}`).json()
  return json
}

export const edit = async (id: string, data: SubjectForm) => {
  const json: JsonResponse<Subject> = await client
    .put(`subjects/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`subjects/${id}`).json()
  return json
}

export const fetchAll = async (): Promise<{ data: Subject[] }> => {
  const json: LaravelPaginatedResource<Subject> = await client
    .get('subjects/all')
    .json()
  return json
}
