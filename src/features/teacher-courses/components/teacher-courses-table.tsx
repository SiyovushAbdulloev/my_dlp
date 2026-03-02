import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { TeacherCourse } from '@/types/teacher_course'
import type { LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/teacher-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

function stripHtml(html: string) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function TeacherCoursesTable() {
  const navigate = useNavigate()

  const [courses, setCourses] =
    useState<LaravelPaginatedResource<TeacherCourse> | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 9, // cards look nicer with 3 columns
  })

  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState<string>('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(pagination.pageIndex + 1)
      setCourses(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex])

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Курс успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const table = useReactTable({
    data: courses?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: courses?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const items = courses?.data ?? []

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative'>
        {fetching && (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        )}

        {items.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {items.map((course) => {
              const isDeleting = deleting === course.id
              const preview = stripHtml(course.content).slice(0, 140)

              return (
                <div
                  key={course.id}
                  onClick={() =>
                    navigate({
                      to: '/teacher-courses/$courseId',
                      params: { courseId: course.id },
                    })
                  }
                  className='group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                >
                  {/* thumbnail */}
                  <div className='relative aspect-[16/9] w-full overflow-hidden bg-slate-100'>
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.name_ru}
                        className='h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]'
                        loading='lazy'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center text-slate-400'>
                        <div className='flex items-center gap-2'>
                          <ImageIcon className='size-5' />
                          <span className='text-sm'>No thumbnail</span>
                        </div>
                      </div>
                    )}

                    {/* top badges */}
                    <div className='absolute top-3 left-3 flex flex-wrap gap-2'>
                      <Badge className='bg-white/80 text-slate-900 backdrop-blur'>
                        RU
                      </Badge>
                      <Badge
                        variant='secondary'
                        className='bg-white/70 text-slate-700 backdrop-blur'
                      >
                        EN / TG
                      </Badge>
                    </div>

                    {/* gradient overlay */}
                    <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100' />
                  </div>

                  <div className='flex flex-col gap-3 p-6'>
                    <div className='space-y-1'>
                      <h3 className='line-clamp-2 text-lg font-semibold text-slate-900'>
                        {course.name_ru}
                      </h3>

                      <div className='flex flex-col gap-0.5 text-sm text-slate-500'>
                        <span className='line-clamp-1'>
                          🇬🇧 {course.name_en}
                        </span>
                        <span className='line-clamp-1'>
                          🇹🇯 {course.name_tg}
                        </span>
                      </div>
                    </div>

                    <p className='line-clamp-3 text-sm text-slate-600'>
                      {preview || '—'}
                    </p>

                    <div className='mt-2 flex items-center justify-end gap-2'>
                      <Link
                        to='/teacher-courses/$courseId/edit'
                        params={{ courseId: course.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-primary'
                      >
                        <PenLine size={18} />
                      </Link>

                      <Button
                        type='button'
                        variant='ghost'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(course.id)
                        }}
                        className='rounded-xl px-2'
                      >
                        {isDeleting ? (
                          <LoaderCircle className='size-5 animate-spin' />
                        ) : (
                          <Trash size={18} />
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
            Пусто.
          </div>
        )}
      </div>

      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
