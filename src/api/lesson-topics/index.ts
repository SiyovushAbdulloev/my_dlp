import { type JsonResponse } from '@/types/json-response.ts'
import { type LessonTopic } from '@/types/lesson_topic.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type LessonTopicForm } from '@/features/lesson-topics/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<LessonTopic>> => {
  const json: LaravelPaginatedResource<LessonTopic> = await client
    .get(`lesson-topics?page=${page}`)
    .json()
  return json
}

export const create = async (data: LessonTopicForm) => {
  const json: JsonResponse<LessonTopic> = await client
    .post('lesson-topics', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<LessonTopic> = await client
    .get(`lesson-topics/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: LessonTopicForm) => {
  const json: LessonTopic = await client
    .put(`lesson-topics/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`lesson-topics/${id}`).json()
  return json
}
