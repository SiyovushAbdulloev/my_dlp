import { type CourseModule } from '@/types/course_module'
import { type JsonResponse } from '@/types/json-response'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client'

export const fetchIndex = async (
  courseId: string,
  page: number
): Promise<LaravelPaginatedResource<CourseModule>> =>
  await client.get(`courses/${courseId}/modules?page=${page}`).json()

export const getById = async (
  courseId: string,
  moduleId: string
): Promise<JsonResponse<CourseModule>> =>
  await client.get(`courses/${courseId}/modules/${moduleId}`).json()

export const create = async (
  courseId: string,
  payload: unknown
): Promise<JsonResponse<CourseModule>> =>
  await client.post(`courses/${courseId}/modules`, { json: payload }).json()

export const edit = async (
  courseId: string,
  moduleId: string,
  payload: unknown
): Promise<JsonResponse<CourseModule>> =>
  await client
    .patch(`courses/${courseId}/modules/${moduleId}`, { json: payload })
    .json()

export const deleteById = async (courseId: string, moduleId: string) =>
  await client.delete(`courses/${courseId}/modules/${moduleId}`).json()
