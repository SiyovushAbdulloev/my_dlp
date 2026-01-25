// import { client } from '@/api/client.ts'
import { sleep } from '@/lib/utils.ts'
import { type Role } from '@/types'
import { type RoleForm } from '@/features/roles/create.tsx'
import { type Permission } from '@/types/role.ts'

export const fetchAll = async (): Promise<{data: Role[]}> => {
  // const json: LaravelPaginatedResource<District> = await client.get(import.meta.env.API_URL + '/api/roles').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({length: 10}).map((_, index) => ({
      id: index + 1 + '',
      name: `Роль №${index + 1}`,
      is_static: false,
      permissions: []
    }))
  }
}

export const fetchPermissions = async (): Promise<{data: Permission[]}> => {
  // const json: LaravelPaginatedResource<District> = await client.get(import.meta.env.API_URL + '/api/permissions').json();
  // return json
  await sleep(3000)
  return {
    data: [
      {
        id: '1',
        name: `regions`,
        description: `Регионы`,
        children: [
          {
            id: '2',
            name: `regions_list`,
            description: `Список`,
          },
          {
            id: '3',
            name: `regions_create`,
            description: `Создание`,
          }
        ]
      },
      {
        id: '4',
        name: `districts`,
        description: `Районы`,
        children: [
          {
            id: '5',
            name: `districts_list`,
            description: `Список`,
          },
          {
            id: '6',
            name: `districts_create`,
            description: `Создание`,
          }
        ]
      },
    ]
  }
}

export const create = async (data: RoleForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/roles', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    name: `Роль`,
    is_static: false,
    permissions: []
  }
}

export const getById = async (id: string) => {
  // const json: Region = await client.get(import.meta.env.API_URL + `/api/roles/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    name: `Роль`,
    is_static: false,
    permissions: [
      {
        id: '5',
        name: `districts_list`,
        description: `Список`,
      },
      {
        id: '6',
        name: `districts_create`,
        description: `Создание`,
      }
    ]
  }
}

export const edit = async (id: string, data: RoleForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + `/api/roles/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    name: `Роль`,
    is_static: false,
    permissions: []
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/roles/${id}`).json();
  // return json

  await sleep(3000)
  return true
}