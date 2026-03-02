// import { client } from '@/api/client.ts'
import { type Webinar } from '@/types/webinar.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type WebinarForm } from '@/features/webinars/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Webinar>> => {
  // const json: LaravelPaginatedResource<Webinar> = await client.get(import.meta.env.API_URL + '/api/webinars').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      topic_ru: `Тема №${index + 1}, page: ${page}`,
      topic_tg: `Мавзуъ №${index + 1}, page: ${page}`,
      topic_en: `Topic №${index + 1}, page: ${page}`,
      start_date: '29.01.2026',
      start_time: '20:00',
      teacher_id: '1',
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

export const create = async (data: WebinarForm) => {
  // const json: Webinar = await client.post(import.meta.env.API_URL + '/api/webinars', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    data,
    topic_ru: `Тема`,
    topic_tg: `Мавзуъ`,
    topic_en: `Topic`,
    start_date: '29.01.2026',
    start_time: '20:00',
    teacher_id: '1',
  }
}

export const getById = async (id: string) => {
  // const json: Webinar = await client.get(import.meta.env.API_URL + `/api/webinars/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    id1: id,
    topic_ru: `Тема`,
    topic_tg: `Мавзуъ`,
    topic_en: `Topic`,
    start_date: '29.01.2026',
    start_time: '20:00',
    teacher_id: '1',
  }
}

export const edit = async (id: string, data: WebinarForm) => {
  // const json: Webinar = await client.post(import.meta.env.API_URL + `/api/webinars/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    topic_ru: data.topic.ru,
    topic_tg: data.topic.tg,
    topic_en: data.topic.en,
    start_date: data.start_date,
    start_time: data.start_time,
    teacher_id: '1',
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/webinars/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
