// import { client } from '@/api/client.ts'
import { DefaultRoles } from '@/types'
import { type User } from '@/types/user.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type UserForm } from '@/features/users/create.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<User>> => {
  // const json: LaravelPaginatedResource<User> = await client.get(import.meta.env.API_URL + '/api/users').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      first_name: `Ахмад №${index + 1}, page: ${page}`,
      last_name: `Ахмадов №${index + 1}, page: ${page}`,
      middle_name: `Ахмадович №${index + 1}, page: ${page}`,
      birthdate: '29.01.2026',
      role: {
        id: '1',
        name: DefaultRoles['SUPER_ADMIN'],
        is_static: true,
        permissions: [],
      },
      is_disabled: false,
      education: 'Оли',
      university: 'УЦА',
      profession: 'Программист',
      category: 'А',
      appointment_date: '29.01.2024',
      phone: '999999999',
      email: 'test@gmail.com',
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

export const create = async (data: UserForm) => {
  // const json: User = await client.post(import.meta.env.API_URL + '/api/users', {
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
  // const json: User = await client.get(import.meta.env.API_URL + `/api/users/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    id1: id,
    first_name: `Ахмад`,
    last_name: `Ахмадов`,
    middle_name: `Ахмадович`,
    birthdate: '29.01.2026',
    role: {
      id: '1',
      name: DefaultRoles['SUPER_ADMIN'],
      is_static: true,
      permissions: [],
    },
    is_disabled: false,
    education: 'Оли',
    university: 'УЦА',
    profession: 'Программист',
    category: 'А',
    appointment_date: '29.01.2024',
    phone: '999999999',
    email: 'test@gmail.com',
    head_directorate_id: '1',
    education_department_id: '1',
  }
}

export const edit = async (id: string, data: UserForm) => {
  // const json: User = await client.post(import.meta.env.API_URL + `/api/users/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    data,
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/users/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
