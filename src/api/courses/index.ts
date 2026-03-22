import { type Course } from '@/types/course'
import { type JsonResponse } from '@/types/json-response'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Course>> =>
  await client.get(`courses?page=${page}`).json()

export const getById = async (id: string): Promise<JsonResponse<Course>> =>
  await client.get(`courses/${id}`).json()

export const create = async (data: FormData): Promise<JsonResponse<Course>> =>
  await client.post('courses', { body: data }).json()

export const edit = async (
  id: string,
  data: FormData
): Promise<JsonResponse<Course>> => {
  return await client.post(`courses/${id}`, { body: data }).json()
}

export const deleteById = async (id: string) =>
  await client.delete(`courses/${id}`).json()
