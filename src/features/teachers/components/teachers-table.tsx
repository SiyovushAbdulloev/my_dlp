import { type ReactNode, useEffect, useMemo, useState } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Teacher, type TeacherCategory } from '@/types/teacher'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle } from 'lucide-react'
import { fetchIndex } from '@/api/teachers'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'
import { DataTablePagination } from '@/components/data-table'

const getColumns = (): ColumnDef<Teacher>[] => [
  {
    accessorKey: 'full_name',
    header: 'ФИО',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'degree',
    header: 'Степень',
  },
  {
    accessorKey: 'university',
    header: 'Университет',
  },
  {
    accessorKey: 'category',
    header: 'Категория',
    cell: (props) => (
      <p>{String((props.getValue() as TeacherCategory)?.label ?? '')}</p>
    ),
  },
  {
    accessorKey: 'subject_ids',
    header: 'Предметы',
    cell: () => <p>Математика, Геометрия</p>,
  },
]

export const TeachersTable = () => {
  const [teachers, setTeachers] =
    useState<LaravelPaginatedResource<Teacher> | null>(null)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [fetching, setFetching] = useState(false)

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(pagination.pageIndex + 1)
      setTeachers(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex])

  const columns = useMemo(() => {
    return getColumns()
  }, [])

  // table нужен только для pagination
  const table = useReactTable({
    data: teachers?.data ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: teachers?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  return (
    <div className='flex flex-col gap-6'>
      <div className='relative rounded-md border'>
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
