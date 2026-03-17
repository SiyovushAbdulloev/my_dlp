import { type JsonResponse } from '@/types/json-response.ts'
import { type VideoLesson } from '@/types/video_lesson.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<VideoLesson>> => {
  const json: LaravelPaginatedResource<VideoLesson> = await client
    .get(`video-lessons?page=${page}`)
    .json()
  return json
}

export const create = async (data: FormData) => {
  const json: VideoLesson = await client
    .post('video-lessons', {
      body: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<VideoLesson> = await client
    .get(`video-lessons/${id}`)
    .json()
  return json
}

export const edit = async (id: string, data: FormData) => {
  const json: VideoLesson = await client
    .post(`video-lessons/${id}`, {
      body: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  console.log({ id })
  const json = await client.delete(`video-lessons/${id}`).json()
  return json
}
