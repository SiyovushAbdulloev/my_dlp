// import { client } from '@/api/client.ts'
import { type HeadDirectorate } from '@/types/head_directorate.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type HeadDirectorateForm } from '@/features/head-directorate/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<HeadDirectorate>> => {
  // const json: LaravelPaginatedResource<HeadDirectorate> = await client.get(import.meta.env.API_URL + '/api/head-directorates').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Сарраёсати №${index + 1}, page: ${page}`,
      name_ru: `Сарраёсат №${index + 1}, page: ${page}`,
      name_en: `Head Directorate department №${index + 1}, page: ${page}`,
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

export const create = async (data: HeadDirectorateForm) => {
  // const json: HeadDirectorate = await client.post(import.meta.env.API_URL + '/api/head-directorates', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    data,
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
  }
}

export const getById = async (id: string) => {
  // const json: HeadDirectorate = await client.get(import.meta.env.API_URL + `/api/head-directorates/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    id1: id,
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
  }
}

export const edit = async (id: string, data: HeadDirectorateForm) => {
  // const json: HeadDirectorate = await client.post(import.meta.env.API_URL + `/api/head-directorates/${id}`, {
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
  // const json = await client.delete(import.meta.env.API_URL + `/api/head-directorates/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
