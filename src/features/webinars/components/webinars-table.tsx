import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Webinar } from '@/types/webinar'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/webinars'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const WebinarsTable = () => {
  const navigate = useNavigate()

  const [webinars, setWebinars] =
    useState<LaravelPaginatedResource<Webinar> | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState<string>('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(pagination.pageIndex + 1)
      setWebinars(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex])

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Вебинар успешно удален')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  // table нужен только для pagination
  const table = useReactTable({
    data: webinars?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: webinars?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  return (
    <div className='flex flex-col gap-6'>
      {/* Cards wrapper */}
      <div className='relative'>
        {/* Loader */}
        {fetching && (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        )}

        {/* Grid */}
        {webinars?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {webinars.data.map((webinar) => {
              const isDeleting = deleting === webinar.id

              return (
                <div
                  key={webinar.id}
                  onClick={() =>
                    navigate({
                      to: '/webinars/$webinarId',
                      params: { webinarId: webinar.id },
                    })
                  }
                  className='group relative cursor-pointer rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                >
                  <div className='flex flex-col gap-4 p-6'>
                    {/* Topic */}
                    <div>
                      <h3 className='text-lg font-semibold text-slate-800'>
                        {webinar.topic_ru}
                      </h3>

                      <div className='mt-2 flex flex-col gap-1 text-sm text-slate-500'>
                        <span>🇹🇯 {webinar.topic_tg}</span>
                        <span>🇬🇧 {webinar.topic_en}</span>
                      </div>
                    </div>

                    {/* Teacher */}
                    <div className='text-sm text-slate-600'>
                      <span className='font-medium'>Учитель:</span>{' '}
                      {webinar.teacher_id}
                    </div>

                    {/* Date & Time */}
                    <div className='flex items-center gap-4 text-sm text-slate-600'>
                      <div className='flex items-center gap-1'>
                        <Calendar size={16} />
                        {webinar.start_date}
                      </div>

                      <div className='flex items-center gap-1'>
                        <Clock size={16} />
                        {webinar.start_time}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='mt-4 flex items-center justify-end gap-2'>
                      <Link
                        to='/webinars/$webinarId/edit'
                        params={{ webinarId: webinar.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='text-slate-500 transition hover:text-primary'
                      >
                        <PenLine size={18} />
                      </Link>

                      <Button
                        type='button'
                        variant='ghost'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(webinar.id)
                        }}
                        className='px-2'
                      >
                        {isDeleting ? (
                          <LoaderCircle className='size-5 animate-spin' />
                        ) : (
                          <Trash size={18} />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-primary/30' />
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex h-32 items-center justify-center text-slate-500'>
            Пусто.
          </div>
        )}
      </div>

      {/* Pagination (НЕ ТРОГАЕМ) */}
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
