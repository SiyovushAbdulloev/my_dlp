import { type Role } from '@/types'
import { type JsonResponse } from '@/types/json-response.ts'
import { type Permission } from '@/types/role.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type RoleForm } from '@/features/roles/create.tsx'

export const fetchAll = async (): Promise<{ data: Role[] }> => {
  const json: LaravelPaginatedResource<Role> = await client.get('roles').json()
  return json
}

export const fetchPermissions = async (): Promise<{ data: Permission[] }> => {
  const json: LaravelPaginatedResource<Permission> = await client
    .get('permissions')
    .json()
  return json
}

export const create = async (data: RoleForm) => {
  const json: JsonResponse<Role> = await client
    .post('roles', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<Role> = await client.get(`roles/${id}`).json()
  return json
}

export const edit = async (id: string, data: RoleForm) => {
  const json: JsonResponse<Role> = await client
    .put(`roles/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`roles/${id}`).json()
  return json
}
