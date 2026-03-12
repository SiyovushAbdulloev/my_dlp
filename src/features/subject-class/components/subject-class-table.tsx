import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type SubjectClass } from '@/types/subject_class.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/subject-class'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { DataTablePagination } from '@/components/data-table'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<SubjectClass>[] => [
  {
    accessorKey: 'class',
    header: 'Класс',
    cell: (props) => {
      const original = props.row.original as SubjectClass
      const cls = `${original.items[0].class.number} ${original.items[0].class.letter}`
      return <p>{cls}</p>
    },
  },
  {
    accessorKey: 'subject',
    header: 'Предметы',
    cell: (props) => {
      const original = props.row.original as SubjectClass
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
      const original = props.row.original as SubjectClass
      const id = original.items[0].class.id
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'subject_class') ? (
            <Link
              params={{ subjectClassId: id }}
              to='/subject-class/$subjectClassId/edit'
            >
              <PenLine />
            </Link>
          ) : null}

          {ability.can('delete', 'subject_class') ? (
            <Button
              type='button'
              variant='ghost'
              disabled={isDeleting}
              onClick={() => opts.onDelete(id)}
              className='px-2'
            >
              {isDeleting ? (
                <LoaderCircle className='size-5 animate-spin' />
              ) : (
                <Trash />
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
  const [fetching, setFetching] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<string>('')

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

  const columns = useMemo(() => {
    return getColumns({ deleting, onDelete })
  }, [deleting])

  const rows = useMemo(() => {
    return Object.entries(subjectClasses?.data ?? {}).map(
      ([classId, group]) => ({
        id: classId,
        items: group.items,
      })
    )
  }, [subjectClasses])

  const table = useReactTable({
    data: rows,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: subjectClasses?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

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

  return (
    <div>
      <div className='relative mb-4 overflow-hidden rounded-md border'>
        {fetching ? (
          <span className='absolute top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center bg-white/70'>
            <LoaderCircle className={'size-10 animate-spin'} />
          </span>
        ) : null}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.column.columnDef.header as ReactNode}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((rowModel) => (
                <TableRow key={rowModel.id}>
                  {rowModel.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Пусто.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
