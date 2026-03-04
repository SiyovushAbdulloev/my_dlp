import { type JsonResponse } from '@/types/json-response.ts'
import { type User } from '@/types/user.ts'
import { client } from '@/api/client.ts'
import { type LoginForm } from '@/features/auth/sign-in/components/user-auth-form.tsx'

export const login = async (data: LoginForm) => {
  const json: JsonResponse<{
    user: User
    token: string
  }> = await client
    .post('login', {
      json: data,
    })
    .json()
  return json
}

export const logout = async () => {
  const response: {
    message: string
  } = await client.post('logout').json()
  return response
}

export const getUser = async () => {
  const json: JsonResponse<User> = await client.get('user').json()
  return json
}
