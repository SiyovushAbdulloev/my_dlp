import ky from 'ky'

export const client = ky.extend({
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('Accept', 'application/json')
      },
    ],
  },
})
