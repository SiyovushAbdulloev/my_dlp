// import { client } from '@/api/client.ts'
import { sleep } from '@/lib/utils.ts'
import { type ChangePasswordForm } from '@/components/change-password.tsx'

export const changePassword = async (data: ChangePasswordForm) => {
  // const json: Region = await client.post(import.meta.env.API_URL + '/api/change-password', {
  //   body: JSON.stringify(data),
  // }).json();
  // return json

  await sleep(3000)
  return true
}