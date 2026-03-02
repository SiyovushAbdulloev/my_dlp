// import { client } from '@/api/client.ts'
import { type SchoolClass } from '@/types/school_class.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type ClassForm } from '@/features/classes/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<SchoolClass>> => {
  // const json: LaravelPaginatedResource<School> = await client.get(import.meta.env.API_URL + '/api/classes').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      number: index + 1,
      letter: `a №${index + 1}, page: ${page}`,
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

export const create = async (data: ClassForm) => {
  // const json: School = await client.post(import.meta.env.API_URL + '/api/classes', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    number: 1,
    letter: 'a',
    data,
  }
}

export const getById = async (id: string) => {
  // const json: School = await client.get(import.meta.env.API_URL + `/api/classes/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    number: 1,
    letter: 'а',
    id1: id,
  }
}

export const edit = async (id: string, data: ClassForm) => {
  // const json: School = await client.post(import.meta.env.API_URL + `/api/classes/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    number: data.number,
    letter: data.letter,
    data,
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/classes/${id}`).json();
  // return json

  await sleep(3000)
  return id
}

export const fetchAll = async (): Promise<{ data: SchoolClass[] }> => {
  // const json: LaravelPaginatedResource<Subject> = await client.get(import.meta.env.API_URL + '/api/classes/all').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      number: index + 1,
      letter: `a №${index + 1}, page: ${index + 1}`,
    })),
  }
}
