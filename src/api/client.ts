import ky from 'ky'
import { ValidationError } from '@/api/errors.ts'

type Laravel422 = {
  message?: string
  errors?: Record<string, string[]>
}

export const client = ky.extend({
  credentials: 'include',
  prefixUrl: import.meta.env.VITE_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        request.headers.set('Accept', 'application/json')
        request.headers.set('Accept-Language', 'ru')
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status !== 422) return

        const data = (await response.clone().json()) as Laravel422

        throw new ValidationError(
          data.message ?? 'Validation error',
          data.errors ?? {}
        )
      },
    ],
  },
})
