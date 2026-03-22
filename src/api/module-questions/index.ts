import { type JsonResponse } from '@/types/json-response'
import { type ModuleQuestion } from '@/types/module_question'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client'

export const fetchIndex = async (
  courseId: string,
  moduleId: string,
  page: number
): Promise<LaravelPaginatedResource<ModuleQuestion>> =>
  await client
    .get(`courses/${courseId}/modules/${moduleId}/questions?page=${page}`)
    .json()

export const getById = async (
  courseId: string,
  moduleId: string,
  questionId: string
): Promise<JsonResponse<ModuleQuestion>> =>
  await client
    .get(`courses/${courseId}/modules/${moduleId}/questions/${questionId}`)
    .json()

export const create = async (
  courseId: string,
  moduleId: string,
  payload: unknown
): Promise<JsonResponse<ModuleQuestion>> =>
  await client
    .post(`courses/${courseId}/modules/${moduleId}/questions`, {
      json: payload,
    })
    .json()

export const edit = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  payload: unknown
): Promise<JsonResponse<ModuleQuestion>> =>
  await client
    .patch(`courses/${courseId}/modules/${moduleId}/questions/${questionId}`, {
      json: payload,
    })
    .json()

export const deleteById = async (
  courseId: string,
  moduleId: string,
  questionId: string
) =>
  await client
    .delete(`courses/${courseId}/modules/${moduleId}/questions/${questionId}`)
    .json()
