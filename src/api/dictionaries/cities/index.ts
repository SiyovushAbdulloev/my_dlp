// import { client } from '@/api/client.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type City } from '@/types/city.ts'
import { type CityForm } from '@/features/dictionaries/cities/create.tsx'

export const fetchIndex = async (page: number): Promise<LaravelPaginatedResource<City>> => {
  // const json: LaravelPaginatedResource<District> = await client.get(import.meta.env.API_URL + '/api/dictionaries/cities').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({length: 10}).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Шахр №${index + 1}, page: ${page}`,
      name_ru: `Город №${index + 1}, page: ${page}`,
      name_en: `City №${index + 1}, page: ${page}`,
      district: {
        id: `district ${index + 1}`,
        name_tg: `Шахри №${index + 1}, page: ${page}`,
        name_ru: `Район №${index + 1}, page: ${page}`,
        name_en: `District №${index + 1}, page: ${page}`,
        region: {
          id: `region ${index + 1}`,
          name_tg: `Вилояти №${index + 1}, page: ${page}`,
          name_ru: `Область №${index + 1}, page: ${page}`,
          name_en: `Region №${index + 1}, page: ${page}`,
        }
      },
      type: 'city'
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

export const create = async (data: CityForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/dictionaries/cities', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
    type: 'city',
    district: {
      id: "1",
      name_tg: `Шахр`,
      name_ru: `Район`,
      name_en: `District`,
      region: {
        id: "1",
        name_tg: `Вилояти`,
        name_ru: `Область`,
        name_en: `Region`,
      }
    }
  }
}

export const getById = async (id: string) => {
  // const json: Region = await client.get(import.meta.env.API_URL + `/api/dictionaries/cities/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: "1",
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
    type: 'city',
    district: {
      id: "1",
      name_tg: `Шахр`,
      name_ru: `Район`,
      name_en: `District`,
      region: {
        id: "1",
        name_tg: `Вилояти`,
        name_ru: `Область`,
        name_en: `Region`,
      }
    }
  }
}

export const edit = async (id: string, data: CityForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + `/api/dictionaries/cities/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    name_ru: 'Name in russian',
    name_tg: 'Name in tajik',
    name_en: 'Name in english',
    type: 'city',
    district: {
      id: "1",
      name_tg: `Шахр`,
      name_ru: `Район`,
      name_en: `District`,
      region: {
        id: "1",
        name_tg: `Вилояти`,
        name_ru: `Область`,
        name_en: `Region`,
      }
    }
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/dictionaries/cities/${id}`).json();
  // return json

  await sleep(3000)
  return true
}