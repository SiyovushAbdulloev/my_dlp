import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Book, type BookType } from '@/types/book'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import {
  Headphones,
  BookOpen,
  LoaderCircle,
  PenLine,
  Trash,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/books'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTablePagination } from '@/components/data-table'

export const BooksTable = () => {
  const navigate = useNavigate()

  const [kind, setKind] = useState<string>('1')
  const isMp3 = kind === '2'

  const [books, setBooks] = useState<LaravelPaginatedResource<Book> | null>(
    null
  )
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState<string>('')

  const table = useReactTable({
    data: books?.data ?? [],
    columns: [], // cards UI; table used only for pagination
    getCoreRowModel: getCoreRowModel(),
    pageCount: books?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(
        pagination.pageIndex + 1,
        parseInt(kind) as BookType
      )
      console.log({ response })
      setBooks(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, isMp3])

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Книга успешно удалена')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const emptyText = useMemo(() => {
    return isMp3 ? 'Пока нет аудио-книг.' : 'Пока нет электронных книг.'
  }, [isMp3])

  return (
    <div className='flex flex-col gap-6'>
      {/* Top tabs */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <Tabs
          value={kind}
          onValueChange={(v) => {
            // reset to first page on tab change
            setPagination((p) => ({ ...p, pageIndex: 0 }))
            setKind(v)
          }}
        >
          <TabsList>
            <TabsTrigger value={'1'} className='gap-2'>
              <BookOpen className='size-4' />
              Электронные книги
            </TabsTrigger>
            <TabsTrigger value={'2'} className='gap-2'>
              <Headphones className='size-4' />
              Аудио книги
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Cards wrapper */}
      <div className='relative'>
        {fetching && (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        )}

        {books?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {books.data.map((book) => {
              const isDeleting = deleting === book.id

              return (
                <div
                  key={book.id}
                  onClick={() =>
                    navigate({
                      to: '/books/$bookId/show',
                      params: { bookId: book.id },
                    })
                  }
                  className='group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                >
                  {/* Thumbnail */}
                  <div className='relative aspect-[16/10] w-full bg-slate-100'>
                    {book.cover ? (
                      <img
                        src={book.cover.url}
                        alt={book.title.ru}
                        className='h-full w-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-slate-400'>
                        <span className='text-sm'>No thumbnail</span>
                      </div>
                    )}

                    {/* gradient overlay */}
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-80' />

                    {/* type badge */}
                    <div className='absolute top-4 left-4 flex items-center gap-2'>
                      {book.type === 2 ? (
                        <Badge className='gap-1'>
                          <Headphones className='size-3.5' />
                          Audio
                        </Badge>
                      ) : (
                        <Badge variant='secondary' className='gap-1'>
                          <BookOpen className='size-3.5' />
                          PDF
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex flex-col gap-3 p-5'>
                    <div className='min-h-[44px]'>
                      <h3 className='line-clamp-2 text-base font-semibold text-slate-900'>
                        {book.title.ru}
                      </h3>
                      <p className='mt-1 line-clamp-1 text-xs text-slate-500'>
                        {book.book.url
                          ? 'Файл прикреплён'
                          : 'Файл не прикреплён'}
                      </p>
                    </div>

                    {/* actions */}
                    <div className='mt-1 flex items-center justify-end gap-2'>
                      <Link
                        to='/books/$bookId/edit'
                        params={{ bookId: book.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='rounded-xl p-2 text-slate-500 transition hover:bg-slate-50 hover:text-primary'
                        aria-label='Edit'
                      >
                        <PenLine className='size-5' />
                      </Link>

                      <Button
                        type='button'
                        variant='ghost'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(book.id)
                        }}
                        className='rounded-xl px-2'
                        aria-label='Delete'
                      >
                        {isDeleting ? (
                          <LoaderCircle className='size-5 animate-spin' />
                        ) : (
                          <Trash className='size-5' />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* hover ring */}
                  <div className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-primary/30' />
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex h-32 items-center justify-center rounded-2xl border border-dashed text-slate-500'>
            {emptyText}
          </div>
        )}
      </div>

      {/* Pagination (do not remove) */}
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
