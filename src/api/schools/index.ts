// import { client } from '@/api/client.ts'
import { type School } from '@/types/school.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type SchoolForm } from '@/features/schools/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<School>> => {
  // const json: LaravelPaginatedResource<School> = await client.get(import.meta.env.API_URL + '/api/schools').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Мактаби №${index + 1}, page: ${page}`,
      name_ru: `Школа №${index + 1}, page: ${page}`,
      name_en: `School №${index + 1}, page: ${page}`,
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

export const create = async (data: SchoolForm) => {
  // const json: School = await client.post(import.meta.env.API_URL + '/api/schools', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    data,
    name_ru: 'School in russian',
    name_tg: 'School in tajik',
    name_en: 'School in english',
  }
}

export const getById = async (id: string) => {
  // const json: School = await client.get(import.meta.env.API_URL + `/api/schools/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    id1: id,
    name_ru: 'School in russian',
    name_tg: 'School in tajik',
    name_en: 'School in english',
  }
}

export const edit = async (id: string, data: SchoolForm) => {
  // const json: School = await client.post(import.meta.env.API_URL + `/api/schools/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    name_ru: data.name.ru,
    name_tg: data.name.tg,
    name_en: data.name.en,
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/schools/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
