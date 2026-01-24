// import { client } from '@/api/client.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type District } from '@/types/district.ts'
import { type DistrictForm } from '@/features/dictionaries/districts/create.tsx'

export const fetchIndex = async (page: number): Promise<LaravelPaginatedResource<District>> => {
  // const json: LaravelPaginatedResource<District> = await client.get(import.meta.env.API_URL + '/api/dictionaries/districts').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({length: 10}).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Шахр №${index + 1}, page: ${page}`,
      name_ru: `Район №${index + 1}, page: ${page}`,
      name_en: `District №${index + 1}, page: ${page}`,
      region: {
        id: "region #1",
        name_tg: `Вилояти №${index + 1}, page: ${page}`,
        name_ru: `Область №${index + 1}, page: ${page}`,
        name_en: `Region №${index + 1}, page: ${page}`,
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

export const create = async (data: DistrictForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/dictionaries/districts', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
    region: {
      id: "1",
      name_tg: `Вилояти`,
      name_ru: `Область`,
      name_en: `Region`,
    }
  }
}

export const getById = async (id: string) => {
  // const json: Region = await client.get(import.meta.env.API_URL + `/api/dictionaries/districts/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: "1",
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
    region: {
      id: "1",
      name_tg: `Вилояти`,
      name_ru: `Область`,
      name_en: `Region`,
    }
  }
}

export const edit = async (id: string, data: DistrictForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + `/api/dictionaries/districts/${id}`, {
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
    region: {
      id: "1",
      name_tg: `Вилояти`,
      name_ru: `Область`,
      name_en: `Region`,
    }
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/dictionaries/districts/${id}`).json();
  // return json

  await sleep(3000)
  return true
}