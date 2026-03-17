import { useNavigate } from '@tanstack/react-router'
import { Route } from '@/routes/_authenticated/video-lessons/$videoLessonId.show.tsx'
import { ArrowLeft } from 'lucide-react'
import ReactPlayer from 'react-player'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

export function VideoLessonsShow() {
  const navigate = useNavigate()
  const { lesson } = Route.useRouteContext()

  const src = lesson.video?.url ?? lesson.link ?? ''

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <header className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-semibold'>{lesson.title.ru}</h1>
          <p className='text-sm text-muted-foreground'>
            🇹🇯 {lesson.title.tg} · 🇬🇧 {lesson.title.en}
          </p>
        </div>

        <Button onClick={() => navigate({ to: '/video-lessons' })}>
          <ArrowLeft size={18} />
          Назад
        </Button>
      </header>

      <div className='h-full w-full rounded-2xl border bg-white p-4'>
        <ReactPlayer width='100%' height='80vh' controls src={src} />
      </div>
    </Main>
  )
}
