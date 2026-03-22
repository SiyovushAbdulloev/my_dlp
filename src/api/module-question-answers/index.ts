import { type JsonResponse } from '@/types/json-response'
import { type ModuleQuestionAnswer } from '@/types/module_question_answer'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client'

export const fetchIndex = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  page: number
): Promise<LaravelPaginatedResource<ModuleQuestionAnswer>> =>
  await client
    .get(
      `courses/${courseId}/modules/${moduleId}/questions/${questionId}/answers?page=${page}`
    )
    .json()

export const getById = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  answerId: string
): Promise<JsonResponse<ModuleQuestionAnswer>> =>
  await client
    .get(
      `courses/${courseId}/modules/${moduleId}/questions/${questionId}/answers/${answerId}`
    )
    .json()

export const create = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  payload: unknown
): Promise<JsonResponse<ModuleQuestionAnswer>> =>
  await client
    .post(
      `courses/${courseId}/modules/${moduleId}/questions/${questionId}/answers`,
      {
        json: payload,
      }
    )
    .json()

export const edit = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  answerId: string,
  payload: unknown
): Promise<JsonResponse<ModuleQuestionAnswer>> =>
  await client
    .patch(
      `courses/${courseId}/modules/${moduleId}/questions/${questionId}/answers/${answerId}`,
      {
        json: payload,
      }
    )
    .json()

export const deleteById = async (
  courseId: string,
  moduleId: string,
  questionId: string,
  answerId: string
) =>
  await client
    .delete(
      `courses/${courseId}/modules/${moduleId}/questions/${questionId}/answers/${answerId}`
    )
    .json()
