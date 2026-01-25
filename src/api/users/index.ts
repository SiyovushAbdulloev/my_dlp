// import { client } from '@/api/client.ts'
import { DefaultRoles } from '@/types'
import { type Gender, type User } from '@/types/user.ts'
import type { LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'
import { type ChangePasswordForm } from '@/components/change-password.tsx'
import type { CityForm } from '@/features/dictionaries/cities/create.tsx'
import { type UserForm } from '@/features/users/create.tsx'

export const changePassword = async (data: ChangePasswordForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/change-password', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return true
}

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<User>> => {
  // const json: LaravelPaginatedResource<District> = await client.get(import.meta.env.API_URL + '/api/users').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: `id#${index}_page${page}`,
      login: `user #${index}`,
      phone: index + 1 + '',
      email: `user#${index + 1}_page${page}@gmail.com`,
      first_name: `User ${index + 1} page ${page}`,
      last_name: `Userov ${index + 1} page ${page}`,
      middle_name: `Userovich ${index + 1} page ${page}`,
      birthdate: new Date().toDateString(),
      gender: 'm' as Gender,
      school_id: '223',
      avatar: 'https://picsum.dev/400/400',
      role: {
        id: '1',
        name: DefaultRoles.SUPER_ADMIN,
        is_static: true,
      },
      is_disabled: false,
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
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/users', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: `id#1_page1`,
    login: `user #1`,
    phone: 1 + '',
    email: `user#1_page$1@gmail.com`,
    first_name: `User 1 page 1`,
    last_name: `Userov 1 page 1`,
    middle_name: `Userovich 1 page 1`,
    birthdate: new Date().toDateString(),
    gender: 'm' as Gender,
    school_id: '223',
    avatar: 'https://picsum.dev/400/400',
    role: {
      id: '1',
      name: DefaultRoles.SUPER_ADMIN,
      is_static: true,
    },
    is_disabled: false,
  }
}

export const getById = async (id: string) => {
  // const json: Region = await client.get(import.meta.env.API_URL + `/api/users/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: `id#1_page1`,
    login: `user #1`,
    phone: 1 + '',
    email: `user#1_page$1@gmail.com`,
    first_name: `User 1 page 1`,
    last_name: `Userov 1 page 1`,
    middle_name: `Userovich 1 page 1`,
    birthdate: new Date().toDateString(),
    gender: 'm' as Gender,
    school_id: '223',
    avatar: 'https://picsum.dev/400/400',
    role: {
      id: '1',
      name: DefaultRoles.SUPER_ADMIN,
      is_static: true,
    },
    is_disabled: false,
  }
}

export const edit = async (id: string, data: CityForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + `/api/users/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: `id#1_page1`,
    login: `user #1`,
    phone: 1 + '',
    email: `user#1_page$1@gmail.com`,
    first_name: `User 1 page 1`,
    last_name: `Userov 1 page 1`,
    middle_name: `Userovich 1 page 1`,
    birthdate: new Date().toDateString(),
    gender: 'm' as Gender,
    school_id: '223',
    avatar: 'https://picsum.dev/400/400',
    role: {
      id: '1',
      name: DefaultRoles.SUPER_ADMIN,
      is_static: true,
    },
    is_disabled: false,
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/users/${id}`).json();
  // return json

  await sleep(3000)
  return true
}
