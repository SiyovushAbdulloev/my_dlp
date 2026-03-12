import { type JsonResponse } from '@/types/json-response.ts'
import { type SubjectClass } from '@/types/subject_class.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type SubjectClassForm } from '@/features/subject-class/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<SubjectClass>> => {
  const json: LaravelPaginatedResource<SubjectClass> = await client
    .get(`subject-class?page=${page}`)
    .json()
  return json
}

export const create = async (data: SubjectClassForm) => {
  const json: JsonResponse<SubjectClass> = await client
    .post('subject-class', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<SubjectClass> = await client
    .get(`subject-class/${id}`)
    .json()
  return json
}

export const edit = async (data: SubjectClassForm) => {
  const json: JsonResponse<SubjectClass> = await client
    .put(`subject-class/${data.class_id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`subject-class/${id}`).json()
  return json
}
