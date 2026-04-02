import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules'
import { type CourseModule } from '@/types/course_module'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { ClipboardList, LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/course-modules'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const CourseModulesTable = () => {
  const navigate = useNavigate()
  const { course } = Route.useRouteContext()

  const [modules, setModules] =
    useState<LaravelPaginatedResource<CourseModule> | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(course.id, pagination.pageIndex + 1)
      setModules(response)
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
      await deleteById(course.id, id)
      toast.success('Модуль успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const table = useReactTable({
    data: modules?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: modules?.meta?.last_page ?? 1,
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

        {modules?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {modules.data.map((module) => {
              const isDeleting = deleting === module.id

              return (
                <div
                  key={module.id}
                  onClick={() => {
                    if (ability.can('list', 'course_lessons')) {
                      navigate({
                        to: '/courses/$courseId/modules/$moduleId/lessons',
                        params: { courseId: course.id, moduleId: module.id },
                      })
                    }
                  }}
                  className='cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900'>
                        {module.title.ru}
                      </h3>
                      <div className='mt-2 text-sm text-slate-500'>
                        <div>🇬🇧 {module.title.en}</div>
                        <div>🇹🇯 {module.title.tg}</div>
                      </div>
                    </div>

                    <div className='rounded-full border px-3 py-1 text-xs font-medium'>
                      #{module.sort_order}
                    </div>
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-3'>
                    <div className='rounded-xl border p-3'>
                      <div className='text-xs text-slate-500'>
                        Проходной балл
                      </div>
                      <div className='text-sm font-semibold'>
                        {module.passing_score}%
                      </div>
                    </div>

                    <div className='rounded-xl border p-3'>
                      <div className='text-xs text-slate-500'>Попытки</div>
                      <div className='text-sm font-semibold'>
                        {module.attempts_allowed}
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 flex items-center justify-end gap-2'>
                    {ability.can('list', 'course_module_questions') ? (
                      <Link
                        to='/courses/$courseId/modules/$moduleId/questions'
                        params={{ courseId: course.id, moduleId: module.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='rounded-xl border bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                      >
                        <ClipboardList className='size-4' />
                      </Link>
                    ) : null}

                    {ability.can('edit', 'course_modules') ? (
                      <Link
                        to='/courses/$courseId/modules/$moduleId/edit'
                        params={{ courseId: course.id, moduleId: module.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='rounded-xl border bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                      >
                        <PenLine className='size-4' />
                      </Link>
                    ) : null}

                    {ability.can('delete', 'course_modules') ? (
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(module.id)
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
