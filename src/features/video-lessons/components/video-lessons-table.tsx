import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type VideoLesson } from '@/types/video_lesson'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import {
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  LoaderCircle,
  PenLine,
  PlayCircle,
  Trash,
} from 'lucide-react'
import ReactPlayer from 'react-player'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/video-lessons'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const VideoLessonsTable = () => {
  const navigate = useNavigate()

  const [lessons, setLessons] =
    useState<LaravelPaginatedResource<VideoLesson> | null>(null)

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
      await deleteById(id)
      toast.success('Видео-урок успешно удалён')
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
          <div className='absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        )}

        {lessons?.data?.length ? (
          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
            {lessons.data.map((lesson) => {
              const isDeleting = deleting === lesson.id

              const videoUrl = lesson.video?.url ?? lesson.link ?? ''
              const hasVideo = Boolean(videoUrl)

              const classLabel = lesson.schoolClass
                ? `${lesson.schoolClass.number}${lesson.schoolClass.letter ? `-${lesson.schoolClass.letter}` : ''}`
                : lesson.class_id

              const subjectLabel =
                lesson.subject?.title.ru ?? lesson.subject_id ?? '—'

              return (
                <div
                  key={lesson.id}
                  onClick={() =>
                    navigate({
                      to: '/video-lessons/$videoLessonId/show',
                      params: { videoLessonId: lesson.id },
                    })
                  }
                  className='group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl'
                >
                  <div className='pointer-events-none absolute -top-24 left-1/2 h-48 w-[420px] -translate-x-1/2 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100' />

                  <div className='relative'>
                    <div className='overflow-hidden rounded-t-2xl border-b border-slate-200 bg-slate-100'>
                      <div className='relative aspect-video'>
                        {hasVideo ? (
                          <>
                            <div className='pointer-events-none absolute inset-0'>
                              <ReactPlayer
                                src={videoUrl}
                                width='100%'
                                height='100%'
                                playing={false}
                                controls={false}
                                muted
                              />
                            </div>
                            <div className='absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-950/10 to-transparent' />
                            <div className='absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm'>
                              <PlayCircle className='size-4' />
                              Видео
                            </div>
                          </>
                        ) : lesson.cover?.url ? (
                          <img
                            src={lesson.cover?.url}
                            alt={lesson.title.ru}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-sm text-slate-500'>
                            <ImageIcon className='mr-2 size-4' />
                            Нет превью
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='relative flex flex-col gap-4 p-6'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='min-w-0'>
                        <h3 className='truncate text-lg font-semibold tracking-tight text-slate-900'>
                          {lesson.title.ru}
                        </h3>

                        <div className='mt-2 flex flex-col gap-1 text-sm text-slate-500'>
                          <span className='truncate'>🇹🇯 {lesson.title.tg}</span>
                          <span className='truncate'>🇬🇧 {lesson.title.en}</span>
                        </div>
                      </div>

                      <div className='shrink-0'>
                        {hasVideo ? (
                          <div className='inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'>
                            <PlayCircle className='size-4' />
                            Media
                          </div>
                        ) : (
                          <div className='inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600'>
                            <BookOpen className='size-4' />
                            Draft
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3'>
                      <div className='rounded-xl border border-slate-200 bg-white/70 p-3'>
                        <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                          <GraduationCap className='size-4' />
                          Класс
                        </div>
                        <div className='mt-1 truncate text-sm font-semibold text-slate-800'>
                          {classLabel}
                        </div>
                      </div>

                      <div className='rounded-xl border border-slate-200 bg-white/70 p-3'>
                        <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
                          <BookOpen className='size-4' />
                          Предмет
                        </div>
                        <div className='mt-1 truncate text-sm font-semibold text-slate-800'>
                          {subjectLabel}
                        </div>
                      </div>
                    </div>

                    <div className='mt-2 flex items-center justify-end gap-2'>
                      <Link
                        to='/video-lessons/$videoLessonId/edit'
                        params={{ videoLessonId: lesson.id }}
                        onClick={(e) => e.stopPropagation()}
                        className='inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-primary'
                      >
                        <PenLine className='size-4' />
                      </Link>

                      <Button
                        type='button'
                        variant='outline'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(lesson.id)
                        }}
                        className='rounded-xl px-3 py-2'
                      >
                        {isDeleting ? (
                          <LoaderCircle className='size-4 animate-spin' />
                        ) : (
                          <Trash className='size-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent transition group-hover:ring-primary/25' />
                </div>
              )
            })}
          </div>
        ) : (
          <div className='flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-500'>
            Пусто.
          </div>
        )}
      </div>

      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
