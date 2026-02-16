// import { client } from '@/api/client.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { type Region } from '@/types'
import { sleep } from '@/lib/utils.ts'
import { type SubjectForm } from '@/features/subjects/create.tsx'
import { type SubjectClass } from '@/types/subject_class.ts'
import { SubjectClassForm } from '@/features/subject-class/create.tsx'

export const fetchIndex = async (page: number): Promise<LaravelPaginatedResource<SubjectClass>> => {
  // const json: LaravelPaginatedResource<SubjectClass> = await client.get(import.meta.env.API_URL + '/api/subject-class').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({length: 10}).map((_, index) => ({
      id: index + 1 + '',
      subject_id: index + 1 + '',
      class_id: index + 1 + '',
      subject: {
        id: index + 1 + '',
        name_tg: `Предмети №${index + 1}, page: ${page}`,
        name_ru: `Предмет №${index + 1}, page: ${page}`,
        name_en: `Subject №${index + 1}, page: ${page}`,
      },
      class: {
        id: index + 1 + '',
        number: index + 1,
        letter: `a №${index + 1}, page: ${page}`,
      }
    })),
    links: {
        first: '',
        last: '',
        prev: null,
        next: null
    },
    meta: {
        current_page: 1,
        from: 0,
        last_page: 6,
        path: '',
        per_page: 10,
        to: 0,
        total: 60
    }
  }
}

export const create = async (data: SubjectClassForm) => {
  // const json: SubjectClass = await client.post(import.meta.env.API_URL + '/api/subject-class', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    subject_id: 1 + '',
    class_id: 1 + '',
    subject: {
      id: 1 + '',
      name_tg: `Предмети №${1}, page: ${1}`,
      name_ru: `Предмет №${1}, page: ${1}`,
      name_en: `Subject №${1}, page: ${1}`,
    },
    class: {
      id: 1 + '',
      number: 1,
      letter: `a №${1}, page: ${1}`,
    }
  }
}

export const getById = async (id: string) => {
  // const json: SubjectClass = await client.get(import.meta.env.API_URL + `/api/subject-class/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    subject_id: 1 + '',
    class_id: 1 + '',
    subject: {
      id: 1 + '',
      name_tg: `Предмети №${1}, page: ${1}`,
      name_ru: `Предмет №${1}, page: ${1}`,
      name_en: `Subject №${1}, page: ${1}`,
    },
    class: {
      id: 1 + '',
      number: 1,
      letter: `a №${1}, page: ${1}`,
    }
  }
}

export const edit = async (id: string, data: SubjectClassForm) => {
  // const json: SubjectClass = await client.post(import.meta.env.API_URL + `/api/subject-class/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1 + '',
    subject_id: 1 + '',
    class_id: 1 + '',
    subject: {
      id: 1 + '',
      name_tg: `Предмети №${1}, page: ${1}`,
      name_ru: `Предмет №${1}, page: ${1}`,
      name_en: `Subject №${1}, page: ${1}`,
    },
    class: {
      id: 1 + '',
      number: 1,
      letter: `a №${1}, page: ${1}`,
    }
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/subject-class/${id}`).json();
  // return json

  await sleep(3000)
  return true
}