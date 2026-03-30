import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

type AdminFormCardProps = {
  title: string
  backTo: string
  actionText: string
  loading?: boolean
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export function AdminFormCard({
  title,
  backTo,
  actionText,
  loading = false,
  onSubmit,
  children,
}: AdminFormCardProps) {
  const navigate = useNavigate()

  return (
    <Main className='flex flex-1 flex-col gap-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-slate-900'>{title}</h1>

        <Button variant='outline' onClick={() => navigate({ to: backTo })}>
          <ArrowLeft className='mr-2 size-4' />
          Назад
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className='flex flex-col gap-6'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
          {children}
        </div>

        {/* Action */}
        <div className='flex justify-end'>
          <Button type='submit' disabled={loading} className='min-w-40'>
            {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
            {actionText}
          </Button>
        </div>
      </form>
    </Main>
  )
}
