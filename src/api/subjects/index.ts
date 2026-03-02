// import { client } from '@/api/client.ts'
import { type Subject } from '@/types/subject.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type SubjectForm } from '@/features/subjects/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Subject>> => {
  // const json: LaravelPaginatedResource<Subject> = await client.get(import.meta.env.API_URL + '/api/subjects').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Предмети №${index + 1}, page: ${page}`,
      name_ru: `Предмет №${index + 1}, page: ${page}`,
      name_en: `Subject №${index + 1}, page: ${page}`,
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

export const create = async (data: SubjectForm) => {
  // const json: Subject = await client.post(import.meta.env.API_URL + '/api/subjects', {
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
  // const json: Subject = await client.get(import.meta.env.API_URL + `/api/subjects/${id}`).json();
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

export const edit = async (id: string, data: SubjectForm) => {
  // const json: Subject = await client.post(import.meta.env.API_URL + `/api/subjects/${id}`, {
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
  // const json = await client.delete(import.meta.env.API_URL + `/api/subjects/${id}`).json();
  // return json

  await sleep(3000)
  return id
}

export const fetchAll = async (): Promise<{ data: Subject[] }> => {
  // const json: LaravelPaginatedResource<Subject> = await client.get(import.meta.env.API_URL + '/api/subjects/all').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Предмети №${index + 1}`,
      name_ru: `Предмет №${index + 1}`,
      name_en: `Subject №${index + 1}`,
    })),
  }
}
