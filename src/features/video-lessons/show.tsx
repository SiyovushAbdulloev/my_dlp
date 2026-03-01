import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/video-lessons/$videoLessonId.tsx'
import { ArrowLeft } from 'lucide-react'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

export function VideoLessonsShow() {
  const navigate = useNavigate()
  const { lesson } = Route.useRouteContext()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {/* Header */}
      <header className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Просмотр видео-урока</h1>
        <Button onClick={() => navigate({ to: '/video-lessons' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <div className='h-full w-full'>
        <ReactPlayer
          width={'100%'}
          height={'80%'}
          src={lesson.video_url ?? lesson.external_url}
        />
      </div>
    </Main>
  )
}
