import ky from 'ky'

export const client = ky.extend({
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request, options) => {
        request.headers.set('Accept', 'application/json')
      }
    ]
  }
})
