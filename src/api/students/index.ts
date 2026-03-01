// import { client } from '@/api/client.ts'
import { type Student } from '@/types/student.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { sleep } from '@/lib/utils.ts'

export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<Student>> => {
  // const json: LaravelPaginatedResource<Student> = await client.get(import.meta.env.API_URL + '/api/students').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      full_name: `Учитель №${index + 1}, page: ${page}`,
      birthday: `29.01.2000 №${index + 1}, page: ${page}`,
      class_id: '',
      class: {
        id: '',
        letter: 'a',
        number: 10,
      },
      phone: `999999999 №${index + 1}, page: ${page}`,
      email: `teacher@gmail.com №${index + 1}, page: ${page}`,
      avatar_url: `https://picsum.dev/400`,
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
