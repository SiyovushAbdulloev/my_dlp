// import { client } from '@/api/client.ts'
import { type EducationDepartment } from '@/types/education_department.ts';
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type';
import { sleep } from '@/lib/utils.ts';
import { type EducationDepartmentForm } from '@/features/education-departments/create.tsx';















export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<EducationDepartment>> => {
  // const json: LaravelPaginatedResource<EducationDepartment> = await client.get(import.meta.env.API_URL + '/api/education-departments').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Маорифи №${index + 1}, page: ${page}`,
      name_ru: `Маориф №${index + 1}, page: ${page}`,
      name_en: `Education department №${index + 1}, page: ${page}`,
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

export const create = async (data: EducationDepartmentForm) => {
  // const json: EducationDepartment = await client.post(import.meta.env.API_URL + '/api/education-departments', {
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
  // const json: EducationDepartment = await client.get(import.meta.env.API_URL + `/api/education-departments/${id}`).json();
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

export const edit = async (id: string, data: EducationDepartmentForm) => {
  // const json: EducationDepartment = await client.post(import.meta.env.API_URL + `/api/education-departments/${id}`, {
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
  // const json = await client.delete(import.meta.env.API_URL + `/api/education-departments/${id}`).json();
  // return json

  await sleep(3000)
  return id
}

