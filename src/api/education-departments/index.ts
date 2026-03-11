import { type EducationDepartment } from '@/types/education_department.ts'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type EducationDepartmentForm } from '@/features/education-departments/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<EducationDepartment>> => {
  const json: LaravelPaginatedResource<EducationDepartment> = await client
    .get(`education-departments?page=${page}`)
    .json()
  return json
}

export const create = async (data: EducationDepartmentForm) => {
  const json: JsonResponse<EducationDepartment> = await client
    .post('education-departments', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<EducationDepartment> = await client
    .get(`education-departments/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: EducationDepartmentForm) => {
  const json: JsonResponse<EducationDepartment> = await client
    .put(`education-departments/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json: JsonResponse<{ message: string }> = await client
    .delete(`education-departments/${id}`)
    .json()
  return json
}
