import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type School } from '@/types/school.ts'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/schools'
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
}): ColumnDef<School>[] => [
  {
    accessorKey: 'name_ru',
    header: 'Наименование',
  },
  {
    accessorKey: 'name_tg',
    header: 'Ном',
  },
  {
    accessorKey: 'name_en',
    header: 'Name',
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id: string = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          <Link params={{ schoolId: id }} to='/schools/$schoolId/edit'>
            <PenLine />
          </Link>

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
        </div>
      )
    },
  },
]

export const SchoolsTable = () => {
  const [schools, setSchools] =
    useState<LaravelPaginatedResource<School> | null>(null)
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
      toast.success('Школа успешно удалена')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const columns = useMemo(() => {
    return getColumns({ deleting, onDelete })
  }, [deleting])

  const table = useReactTable({
    data: schools?.data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: schools?.meta?.last_page ?? 1,
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
      setSchools(response)
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
