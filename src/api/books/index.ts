// import { client } from '@/api/client.ts'
import { type Book } from '@/types/book.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'

export const fetchIndex = async (
  page: number,
  isMp3: boolean
): Promise<LaravelPaginatedResource<Book>> => {
  // const json: LaravelPaginatedResource<Book> = await client.get(import.meta.env.API_URL + '/api/books').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 9 }).map((_, index) => ({
      id: index + 1 + '',
      name_tg: `Китоби №${index + 1}, page: ${page}`,
      name_ru: `Книга №${index + 1}, page: ${page}`,
      name_en: `Book №${index + 1}, page: ${page}`,
      is_mp3: isMp3 ? true : index % 2 === 0,
      file_url: '',
      thumbnail_url: 'https://picsum.dev/400',
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

export const create = async (data: FormData) => {
  // const json: Book = await client.post(import.meta.env.API_URL + '/api/books', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: 1,
    data,
    name_tg: `Китоби`,
    name_ru: `Книга`,
    name_en: `Book`,
    is_mp3: false,
    file_url:
      'https://pdf.infobooks.org/ING/PDF/the-anatomy-of-the-domestic-animals-septimus-sisson-2181.pdf',
    thumbnail_url: 'https://picsum.dev/400',
  }
}

export const getById = async (id: string) => {
  // const json: Book = await client.get(import.meta.env.API_URL + `/api/books/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    id1: id,
    name_tg: `Китоби`,
    name_ru: `Книга`,
    name_en: `Book`,
    is_mp3: true,
    file_url:
      'https://pdf.infobooks.org/ING/PDF/the-anatomy-of-the-domestic-animals-septimus-sisson-2181.pdf',
    thumbnail_url: 'https://picsum.dev/400',
  }
}

export const edit = async (id: string, data: FormData) => {
  // const json: Book = await client.post(import.meta.env.API_URL + `/api/books/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    data,
    name_tg: `Китоби`,
    name_ru: `Книга`,
    name_en: `Book`,
    is_mp3: false,
    file_url:
      'https://pdf.infobooks.org/ING/PDF/the-anatomy-of-the-domestic-animals-septimus-sisson-2181.pdf',
    thumbnail_url: 'https://picsum.dev/400',
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/books/${id}`).json();
  // return json

  await sleep(3000)
  return id
}
