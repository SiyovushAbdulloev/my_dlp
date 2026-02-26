import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { WebinarChat } from './components/webinars-chat'
import { WebinarParticipants } from './components/webinars-participants'
import { WebinarVideo } from './components/webinars-video'

export function WebinarsShow() {
  const navigate = useNavigate()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Header */}
      <header className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Просмотр вебинара</h1>
        <Button onClick={() => navigate({ to: '/webinars' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-6 lg:flex-row'>
        {/* 65% Video */}
        <div className='w-full lg:w-[65%]'>
          <WebinarVideo />
        </div>

        {/* 35% Sidebar */}
        <div className='flex w-full flex-col gap-6 lg:w-[35%]'>
          <div className='min-h-[250px] flex-[0.45]'>
            <WebinarParticipants />
          </div>

          <div className='min-h-[300px] flex-[0.55]'>
            <WebinarChat />
          </div>
        </div>
      </div>
    </Main>
  )
}
