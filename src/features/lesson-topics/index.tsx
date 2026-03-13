import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button.tsx'
import { Main } from '@/components/layout/main'
import { LessonTableTable } from './components/lesson-table-table.tsx'

export function LessonTopics() {
  const navigate = useNavigate()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Темы уроков</h2>
          </div>
          {ability.can('create', 'lesson_topics') ? (
            <Button
              className='space-x-1'
              onClick={() => navigate({ to: '/lesson-topics/create' })}
            >
              <span>Создать тему урока</span> <Plus size={18} />
            </Button>
          ) : null}
        </div>
        <LessonTableTable />
      </Main>
    </>
  )
}
