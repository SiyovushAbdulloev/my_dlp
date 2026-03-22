import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/lessons'
import { type CourseLesson } from '@/types/course_lesson'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import {
  FileText,
  Film,
  LoaderCircle,
  Paperclip,
  PenLine,
  Trash,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/course-lessons'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const CourseLessonsTable = () => {
  const { course, module } = Route.useRouteContext()

  const [lessons, setLessons] =
    useState<LaravelPaginatedResource<CourseLesson> | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(
        course.id,
        module.id,
        pagination.pageIndex + 1
      )
      setLessons(response)
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
      await deleteById(course.id, module.id, id)
      toast.success('Урок успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const table = useReactTable({
    data: lessons?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: lessons?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative'>
        {fetching && (
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        )}

        {lessons?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {lessons.data.map((lesson) => {
              const isDeleting = deleting === lesson.id

              return (
                <div
                  key={lesson.id}
                  className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-lg font-semibold text-slate-900'>
                        {lesson.title.ru}
                      </h3>
                      <div className='mt-2 text-sm text-slate-500'>
                        <div>🇬🇧 {lesson.title.en}</div>
                        <div>🇹🇯 {lesson.title.tg}</div>
                      </div>
                    </div>

                    <div className='rounded-full border px-3 py-1 text-xs font-medium'>
                      #{lesson.sort_order}
                    </div>
                  </div>

                  <div className='mt-4 grid grid-cols-2 gap-3'>
                    <div className='rounded-xl border p-3'>
                      <div className='text-xs text-slate-500'>Длительность</div>
                      <div className='text-sm font-semibold'>
                        {lesson.duration_minutes ?? '—'} мин.
                      </div>
                    </div>

                    <div className='rounded-xl border p-3'>
                      <div className='text-xs text-slate-500'>Файлы</div>
                      <div className='text-sm font-semibold'>
                        {lesson.files?.length ?? 0}
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 flex flex-wrap gap-2'>
                    {lesson.video?.url || lesson.video_link ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs'>
                        <Film className='size-3.5' />
                        Видео
                      </span>
                    ) : null}

                    {lesson.text_content?.ru ||
                    lesson.text_content?.en ||
                    lesson.text_content?.tg ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs'>
                        <FileText className='size-3.5' />
                        Текст
                      </span>
                    ) : null}

                    {lesson.files?.length ? (
                      <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs'>
                        <Paperclip className='size-3.5' />
                        Материалы
                      </span>
                    ) : null}
                  </div>

                  <div className='mt-6 flex items-center justify-end gap-2'>
                    <Link
                      to='/courses/$courseId/modules/$moduleId/lessons/$lessonId/edit'
                      params={{
                        courseId: course.id,
                        moduleId: module.id,
                        lessonId: lesson.id,
                      }}
                      className='rounded-xl border bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                    >
                      <PenLine className='size-4' />
                    </Link>

                    <Button
                      type='button'
                      variant='outline'
                      disabled={isDeleting}
                      onClick={() => onDelete(lesson.id)}
                    >
                      {isDeleting ? (
                        <LoaderCircle className='size-4 animate-spin' />
                      ) : (
                        <Trash className='size-4' />
                      )}
                    </Button>
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
