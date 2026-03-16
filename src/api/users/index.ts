import { type JsonResponse } from '@/types/json-response.ts'
import { type User } from '@/types/user.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'
import { type UserForm } from '@/features/users/create.tsx'
import { type UserEditForm } from '@/features/users/edit.tsx'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<User>> => {
  const json: LaravelPaginatedResource<User> = await client
    .get(`users?page=${page}`)
    .json()
  return json
}

export const create = async (data: UserForm) => {
  const json: JsonResponse<User> = await client
    .post('users', {
      json: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<User> = await client.get(`users/${id}`).json()
  return json
}

export const edit = async (id: string, data: UserEditForm) => {
  const json: JsonResponse<User> = await client
    .put(`users/${id}`, {
      json: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`users/${id}`).json()
  return json
}
