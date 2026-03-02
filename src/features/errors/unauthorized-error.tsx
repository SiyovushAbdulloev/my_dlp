import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function UnauthorisedError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Несанкционированный доступ</span>
        <p className='text-center text-muted-foreground'>
          Пожалуйста, войдите в систему с соответствующими учетными данными,{' '}
          <br />
          чтобы получить доступ к этому ресурсу.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Назад
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>Главная</Button>
        </div>
      </div>
    </div>
  )
}
