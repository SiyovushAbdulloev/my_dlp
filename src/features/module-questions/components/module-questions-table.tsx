import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Route } from '@/routes/_authenticated/courses/$courseId/modules/$moduleId/questions'
import { type ModuleQuestion } from '@/types/module_question'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/module-questions'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'

export const ModuleQuestionsTable = () => {
  // const navigate = useNavigate()
  const { course, module } = Route.useRouteContext()

  const [questions, setQuestions] =
    useState<LaravelPaginatedResource<ModuleQuestion> | null>(null)

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
      setQuestions(response)
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
      toast.success('Вопрос успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const table = useReactTable({
    data: questions?.data ?? [],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    pageCount: questions?.meta?.last_page ?? 1,
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

        {questions?.data?.length ? (
          <div className='space-y-4'>
            {questions.data.map((question) => {
              const isDeleting = deleting === question.id

              return (
                <div
                  key={question.id}
                  // onClick={() =>
                  //   navigate({
                  //     to: '/courses/$courseId/modules/$moduleId/questions/$questionId/answers',
                  //     params: {
                  //       courseId: course.id,
                  //       moduleId: module.id,
                  //       questionId: question.id,
                  //     },
                  //   })
                  // }
                  className='w-fit cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <h3 className='text-base font-semibold text-slate-900'>
                        {question.text.ru}
                      </h3>
                      <div className='mt-2 text-sm text-slate-500'>
                        <div>🇬🇧 {question.text.en}</div>
                        <div>🇹🇯 {question.text.tg}</div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <span className='rounded-full border px-3 py-1 text-xs'>
                        {question.type}
                      </span>
                      <span className='rounded-full border px-3 py-1 text-xs'>
                        #{question.sort_order}
                      </span>
                    </div>
                  </div>

                  <div className='mt-6 flex items-center justify-end gap-2'>
                    {ability.can('edit', 'course_module_questions') ? (
                      <Link
                        to='/courses/$courseId/modules/$moduleId/questions/$questionId/edit'
                        params={{
                          courseId: course.id,
                          moduleId: module.id,
                          questionId: question.id,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className='rounded-xl border bg-white px-3 py-2 text-slate-600 transition hover:text-primary'
                      >
                        <PenLine className='size-4' />
                      </Link>
                    ) : null}

                    {ability.can('delete', 'course_module_questions') ? (
                      <Button
                        type='button'
                        variant='outline'
                        disabled={isDeleting}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(question.id)
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
