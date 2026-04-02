import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  type Course,
  CourseDifficultyLabel,
  CourseStatusLabel,
} from '@/types/course'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/courses'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const CoursesTable = () => {
  const navigate = useNavigate()
  const [courses, setCourses] =
    useState<LaravelPaginatedResource<Course> | null>(null)
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

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

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative'>
        {fetching ? (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        ) : null}

        {courses?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {courses.data.map((course) => {
              const isDeleting = deleting === course.id

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    if (ability.can('list', 'course_modules')) {
                      navigate({
                        to: '/courses/$courseId/modules',
                        params: { courseId: course.id },
                      })
                    }
                  }}
                  className='group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl'
                >
                  <div className='aspect-[16/9] bg-slate-100'>
                    {course.cover?.url ? (
                      <img
                        src={course.cover.url}
                        alt={course.title.ru}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>

                  <div className='p-6'>
                    <h3 className='text-lg font-semibold text-slate-900'>
                      {course.title.ru}
                    </h3>

                    <div className='mt-2 text-sm text-slate-500'>
                      <div>🇬🇧 {course.title.en}</div>
                      <div>🇹🇯 {course.title.tg}</div>
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-3 text-sm'>
                      <div className='rounded-xl border border-slate-200 p-3'>
                        <div className='text-slate-500'>Сложность</div>
                        <div className='font-semibold'>
                          {CourseDifficultyLabel[course.difficulty]}
                        </div>
                      </div>

                      <div className='rounded-xl border border-slate-200 p-3'>
                        <div className='text-slate-500'>Статус</div>
                        <div className='font-semibold'>
                          {CourseStatusLabel[course.status]}
                        </div>
                      </div>
                    </div>

                    <div className='mt-4 flex items-center justify-end gap-2'>
                      {ability.can('edit', 'courses') ? (
                        <Link
                          to='/courses/$courseId/edit'
                          params={{ courseId: course.id }}
                          onClick={(e) => e.stopPropagation()}
                          className='rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                        >
                          <PenLine className='size-4' />
                        </Link>
                      ) : null}

                      {ability.can('delete', 'courses') ? (
                        <Button
                          type='button'
                          variant='outline'
                          disabled={isDeleting}
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(course.id)
                          }}
                        >
                          {isDeleting ? (
                            <LoaderCircle className='size-4 animate-spin' />
                          ) : (
                            <Trash className='size-4' />
                          )}
                        </Button>
                      ) : null}
                    </div>
                  </div>
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
