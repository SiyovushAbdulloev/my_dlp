import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type SubjectClass } from '@/types/subject_class'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/subject-class'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminTableCard } from '@/components/admin/table-card'

type SubjectClassRow = {
  id: string
  items: SubjectClass['items']
}

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<SubjectClassRow>[] => [
  {
    accessorKey: 'class',
    header: 'Класс',
    cell: (props) => {
      const original = props.row.original
      const cls = original.items.length
        ? `${original.items[0].class.number} ${original.items[0].class.letter}`
        : ''
      return <p className='font-medium'>{cls}</p>
    },
  },
  {
    accessorKey: 'subject',
    header: 'Предметы',
    cell: (props) => {
      const original = props.row.original
      const subjects = original.items
        .map((item) => item.subject.title.ru)
        .join(', ')
      return <p>{subjects}</p>
    },
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id = props.row.original.id
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'subject_class') ? (
            <Link
              params={{ subjectClassId: id }}
              to='/subject-class/$subjectClassId/edit'
              className='rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50'
            >
              <PenLine className='size-4' />
            </Link>
          ) : null}

          {ability.can('delete', 'subject_class') ? (
            <Button
              type='button'
              variant='ghost'
              disabled={isDeleting}
              onClick={() => opts.onDelete(id)}
              className='rounded-lg p-2 text-red-600 hover:bg-red-50'
            >
              {isDeleting ? (
                <LoaderCircle className='size-4 animate-spin' />
              ) : (
                <Trash className='size-4' />
              )}
            </Button>
          ) : null}
        </div>
      )
    },
  },
]

export const SubjectClassTable = () => {
  const [subjectClasses, setSubjectClasses] =
    useState<LaravelPaginatedResource<SubjectClass> | null>(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(pagination.pageIndex + 1)
      setSubjectClasses(response)
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
      toast.success('Предмет-класс успешно удален')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const rows = useMemo<SubjectClassRow[]>(() => {
    return Object.entries(subjectClasses?.data ?? {}).map(
      ([classId, group]) => ({
        id: classId,
        items: group.items,
      })
    )
  }, [subjectClasses])

  const columns = useMemo(() => getColumns({ deleting, onDelete }), [deleting])

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: subjectClasses?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const currentPage = pagination.pageIndex + 1
  const totalPages = subjectClasses?.meta?.last_page ?? 1
  const total = subjectClasses?.meta?.total ?? 0
  const currentRowsCount = table.getRowModel().rows.length
  const start = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const end = total === 0 ? 0 : start + currentRowsCount - 1

  return (
    <AdminTableCard
      fetching={fetching}
      table={table}
      columnsLength={columns.length}
      start={start}
      end={end}
      total={total}
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevPage={() =>
        setPagination((prev) => ({
          ...prev,
          pageIndex: Math.max(0, prev.pageIndex - 1),
        }))
      }
      onNextPage={() =>
        setPagination((prev) => ({
          ...prev,
          pageIndex: Math.min(totalPages - 1, prev.pageIndex + 1),
        }))
      }
    />
  )
}
