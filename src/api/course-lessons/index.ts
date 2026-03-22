import { type CourseLesson } from '@/types/course_lesson'
import { type JsonResponse } from '@/types/json-response'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client'

export const fetchIndex = async (
  courseId: string,
  moduleId: string,
  page: number
): Promise<LaravelPaginatedResource<CourseLesson>> =>
  await client
    .get(`courses/${courseId}/modules/${moduleId}/lessons?page=${page}`)
    .json()

export const getById = async (
  courseId: string,
  moduleId: string,
  lessonId: string
): Promise<JsonResponse<CourseLesson>> =>
  await client
    .get(`courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
    .json()

export const create = async (
  courseId: string,
  moduleId: string,
  data: FormData
): Promise<JsonResponse<CourseLesson>> =>
  await client
    .post(`courses/${courseId}/modules/${moduleId}/lessons`, {
      body: data,
    })
    .json()

export const edit = async (
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: FormData
): Promise<JsonResponse<CourseLesson>> => {
  data.append('_method', 'PUT')

  return await client
    .post(`courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
      body: data,
    })
    .json()
}

export const deleteById = async (
  courseId: string,
  moduleId: string,
  lessonId: string
) =>
  await client
    .delete(`courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`)
    .json()
