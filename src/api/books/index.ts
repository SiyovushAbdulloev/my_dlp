import { type Book, type BookType } from '@/types/book.ts'
import { type JsonResponse } from '@/types/json-response.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { client } from '@/api/client.ts'

export const fetchIndex = async (
  page: number,
  type?: BookType
): Promise<LaravelPaginatedResource<Book>> => {
  let url = `libraries?page=${page}`
  if (type) {
    url += `&type=${type}`
  }
  const json: LaravelPaginatedResource<Book> = await client.get(url).json()
  return json
}

export const create = async (data: FormData) => {
  const json: JsonResponse<Book> = await client
    .post('libraries', {
      body: data,
    })
    .json()
  return json
}

export const getById = async (id: string) => {
  const json: JsonResponse<Book> = await client.get(`libraries/${id}`).json()
  return json
}

export const edit = async (id: string, data: FormData) => {
  const json: JsonResponse<Book> = await client
    .post(`libraries/${id}`, {
      body: data,
    })
    .json()
  return json
}

export const deleteById = async (id: string) => {
  const json = await client.delete(`libraries/${id}`).json()
  return json
}
