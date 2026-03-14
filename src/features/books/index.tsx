import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'
import { BooksTable } from './components/books-table'

export function Books() {
  const navigate = useNavigate()

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Книги</h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Электронные и аудио-книги с превью и загрузкой файлов.
          </p>
        </div>

        {ability.can('create', 'libraries') ? (
          <Button
            className='space-x-1'
            onClick={() => navigate({ to: '/books/create' })}
          >
            <span>Добавить книгу</span> <Plus size={18} />
          </Button>
        ) : null}
      </div>

      <BooksTable />
    </Main>
  )
}
