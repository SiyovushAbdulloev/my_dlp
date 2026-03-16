import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type User } from '@/types/user'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/users'
import { ability } from '@/lib/casl/ability.ts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<User>[] => [
  {
    accessorKey: 'last_name',
    header: 'Фамилия',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'first_name',
    header: 'Имя',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'middle_name',
    header: 'Отчество',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id = String(props.getValue())
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'users') ? (
            <Link params={{ userId: id }} to='/users/$userId/edit'>
              <PenLine className='size-5' />
            </Link>
          ) : null}

          {ability.can('delete', 'users') ? (
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
                <Trash className='size-5' />
              )}
            </Button>
          ) : null}
        </div>
      )
    },
  },
]

export function UsersTable() {
  const [users, setUsers] = useState<LaravelPaginatedResource<User> | null>(
    null
  )
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
      console.log('response', response)
      setUsers(response)
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
      toast.success('Пользователь успешно удалён')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const columns = useMemo(() => {
    return getColumns({ deleting, onDelete })
  }, [deleting])

  const table = useReactTable({
    data: users?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: users?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  return (
    <div>
      <div className='relative mb-4 overflow-hidden rounded-md border bg-white'>
        {fetching ? (
          <span className='absolute inset-0 z-10 flex items-center justify-center bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
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
