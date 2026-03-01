// import { client } from '@/api/client.ts'
import { type LessonTopic } from '@/types/lesson_topic.ts';
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type';
import { sleep } from '@/lib/utils.ts';
import { type RegionForm } from '@/features/dictionaries/regions/create.tsx';
import { LessonTopicForm } from '@/features/lesson-topics/create.tsx';









export const fetchIndex = async (
  page: number
): Promise<LaravelPaginatedResource<LessonTopic>> => {
  // const json: LaravelPaginatedResource<LessonTopic> = await client.get(import.meta.env.API_URL + '/api/lesson-topics').json();
  // return json
  await sleep(3000)
  return {
    data: Array.from({ length: 10 }).map((_, index) => ({
      id: index + 1 + '',
      class_id: '',
      class: {
        id: '',
        number: 10,
        letter: 'a'
      },
      subject_id: '',
      subject: {
        id: '',
        name_ru: 'Геометрия',
        name_en: 'Геометрия',
        name_tg: 'Геометрия',
      },
      topic: 'Площадь многоугольников',
      content: 'alksdfjlkasdfj klasfjsda'
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

export const create = async (data: LessonTopicForm) => {
  // const json: LessonTopic = await client.post(import.meta.env.API_URL + '/api/lesson-topics', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    class_id: '',
    class: {
      id: '',
      number: 10,
      letter: 'a'
    },
    subject_id: '',
    subject: {
      id: '',
      name_ru: 'Геометрия',
      name_en: 'Геометрия',
      name_tg: 'Геометрия',
    },
    topic: 'Площадь многоугольников',
    content: 'alksdfjlkasdfj klasfjsda'
  }
}

export const getById = async (id: string) => {
  // const json: LessonTopic = await client.get(import.meta.env.API_URL + `/api/lesson-topics/${id}`).json();
  // return json

  await sleep(3000)
  return {
    id: '1',
    class_id: '1',
    class: {
      id: '',
      number: 10,
      letter: 'a'
    },
    subject_id: '1',
    subject: {
      id: '',
      name_ru: 'Геометрия',
      name_en: 'Геометрия',
      name_tg: 'Геометрия',
    },
    topic: 'Площадь многоугольников',
    content: 'alksdfjlkasdfj klasfjsda'
  }
}

export const edit = async (id: string, data: LessonTopicForm) => {
  // const json: LessonTopic = await client.post(import.meta.env.API_URL + `/api/lesson-topics/${id}`, {
  //   method: 'PUT',
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return {
    id: id,
    class_id: '1',
    class: {
      id: '',
      number: 10,
      letter: 'a'
    },
    subject_id: '1',
    subject: {
      id: '',
      name_ru: 'Геометрия',
      name_en: 'Геометрия',
      name_tg: 'Геометрия',
    },
    topic: 'Площадь многоугольников',
    content: 'alksdfjlkasdfj klasfjsda'
  }
}

export const deleteById = async (id: string) => {
  // const json = await client.delete(import.meta.env.API_URL + `/api/lesson-topics/${id}`).json();
  // return json

  await sleep(3000)
  return true
}
