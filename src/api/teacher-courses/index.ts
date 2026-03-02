// import { client } from '@/api/client.ts'
import { type TeacherCourse } from '@/types/teacher_course.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type RegionForm } from '@/features/dictionaries/regions/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<TeacherCourse>> => {
  // const json: LaravelPaginatedResource<TeacherCourse> = await client.get(import.meta.env.API_URL + '/api/teacher-courses').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Курси №${index + 1}, page: ${page}`,
      name_ru: `Курс №${index + 1}, page: ${page}`,
      name_en: `Course №${index + 1}, page: ${page}`,
      content: 'Lorem ipsum dolor sit amet',
      thumbnail_url: 'https://picsum.photos/400',
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

export const create = async (data: RegionForm) => {
  // const json: TeacherCourse = await client.post(import.meta.env.API_URL + '/api/teacher-courses', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    data,
    name_tg: `Курси`,
    name_ru: `Курс`,
    name_en: `Course`,
    content: 'Lorem ipsum dolor sit amet',
    thumbnail_url: 'https://picsum.photos/400',
  }
}

export const getById = async (id: string) => {
  // const json: TeacherCourse = await client.get(import.meta.env.API_URL + `/api/teacher-courses/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    id1: id,
    name_tg: `Курси`,
    name_ru: `Курс`,
    name_en: `Course`,
    content: 'Lorem ipsum dolor sit amet',
    thumbnail_url: 'https://picsum.photos/400',
  }
}

export const edit = async (id: string, data: RegionForm) => {
  // const json: TeacherCourse = await client.post(import.meta.env.API_URL + `/api/teacher-courses/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    name_tg: `Курси`,
    name_ru: `Курс`,
    name_en: `Course`,
    content: 'Lorem ipsum dolor sit amet',
    thumbnail_url: 'https://picsum.photos/400',
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/teacher-courses/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
