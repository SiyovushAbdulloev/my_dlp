import { Main } from '@/components/layout/main'
import { VideoLessonsTable } from './components/video-lessons-table.tsx'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { useNavigate } from '@tanstack/react-router'

export function VideoLessons() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Видео-уроки</h2>
          </div>
          <Button className='space-x-1' onClick={() => navigate({to: '/video-lessons/create'})}>
            <span>Создать видео-урок</span> <Plus size={18} />
          </Button>
        </div>
        <VideoLessonsTable />
      </Main>
    </>
  )
}
