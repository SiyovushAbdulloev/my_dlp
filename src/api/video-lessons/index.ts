// import { client } from '@/api/client.ts'
import { type VideoLesson } from '@/types/video_lesson.ts';
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type';
import { sleep } from '@/lib/utils.ts';
import { VideoLessonForm } from '@/features/video-lessons/create.tsx';
import { type WebinarForm } from '@/features/webinars/create.tsx';









export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<VideoLesson>> => {
  // const json: LaravelPaginatedResource<VideoLesson> = await client.get(import.meta.env.API_URL + '/api/video-lessons').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      title_ru: `Заголовок №${index + 1}, page: ${page}`,
      title_tg: `Заголовок №${index + 1}, page: ${page}`,
      title_en: `Title №${index + 1}, page: ${page}`,
      class_id: '1',
      subject_id: '1',
      class: {
        id: '1',
        number: 10,
        letter: 'a'
      },
      subject: {
        name_ru: `Предмет №${index + 1}, page: ${page}`,
        name_en: `Subject №${index + 1}, page: ${page}`,
        name_tg: `Фан №${index + 1}, page: ${page}`,
      }
    })),
    links: {
      first: '',
      last: '',
      prev: null,
      next: null,
    },
    meta: {
      current_page: 1,
      from: 0,
      last_page: 6,
      path: '',
      per_page: 10,
      to: 0,
      total: 60,
    },
  }
}

export const create = async (data: VideoLessonForm) => {
  // const json: VideoLesson = await client.post(import.meta.env.API_URL + '/api/video-lessons', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    title_ru: `Заголовок`,
    title_tg: `Заголовок`,
    title_en: `Title`,
    class_id: '1',
    subject_id: '1',
  }
}

export const getById = async (id: string) => {
  // const json: VideoLesson = await client.get(import.meta.env.API_URL + `/api/video-lessons/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    title_ru: `Заголовок`,
    title_tg: `Заголовок`,
    title_en: `Title`,
    class_id: '1',
    subject_id: '1',
  }
}

export const edit = async (id: string, data: VideoLessonForm) => {
  // const json: VideoLesson = await client.post(import.meta.env.API_URL + `/api/video-lessons/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    title_ru: `Заголовок`,
    title_tg: `Заголовок`,
    title_en: `Title`,
    class_id: '1',
    subject_id: '1',
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/video-lessons/${id}`).json();
  // return json

  await sleep(3000)
  return true
}
