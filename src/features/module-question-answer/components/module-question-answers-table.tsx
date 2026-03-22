import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions/$questionId/answers'
import { type ModuleQuestionAnswer } from '@/types/module_question_answer'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import {
  CheckCircle2,
  LoaderCircle,
  PenLine,
  Trash,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/module-question-answers'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const ModuleQuestionAnswersTable = () => {
  const { course, module, question } = Route.useRouteContext()

  const [answers, setAnswers] =
    useState<LaravelPaginatedResource<ModuleQuestionAnswer> | null>(null)

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
        question.id,
        pagination.pageIndex + 1
      )
      setAnswers(response)
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
      await deleteById(course.id, module.id, question.id, id)
      toast.success('Ответ успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const table = useReactTable({
    data: answers?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: answers?.meta?.last_page ?? 1,
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

        {answers?.data?.length ? (
          <div className='space-y-4'>
            {answers.data.map((answer) => {
              const isDeleting = deleting === answer.id

              return (
                <div
                  key={answer.id}
                  className='w-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-base font-semibold text-slate-900'>
                        {answer.text.ru}
                      </h3>
                      <div className='mt-2 text-sm text-slate-500'>
                        <div>🇬🇧 {answer.text.en}</div>
                        <div>🇹🇯 {answer.text.tg}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='rounded-full border px-3 py-1 text-xs'>
                        #{answer.sort_order}
                      </span>

                      {answer.is_correct ? (
                        <span className='inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700'>
                          <CheckCircle2 className='size-3.5' />
                          Верный
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600'>
                          <XCircle className='size-3.5' />
                          Неверный
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='mt-6 flex items-center justify-end gap-2'>
                    {ability.can('edit', 'course_module_question_answers') ? (
                      <Link
                        to='/courses/$courseId/modules/$moduleId/questions/$questionId/answers/$answerId/edit'
                        params={{
                          courseId: course.id,
                          moduleId: module.id,
                          questionId: question.id,
                          answerId: answer.id,
                        }}
                        className='rounded-xl border bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                      >
                        <PenLine className='size-4' />
                      </Link>
                    ) : null}

                    {ability.can('delete', 'course_module_question_answers') ? (
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isDeleting}
                        onClick={() => onDelete(answer.id)}
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
