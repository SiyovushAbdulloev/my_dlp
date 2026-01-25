import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { type User } from '@/types/user.ts';
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type';
import { LoaderCircle, PenLine, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { deleteById, fetchIndex } from '@/api/users';
import { cn } from '@/lib/utils.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DataTableColumnHeader,
  DataTablePagination,
} from '@/components/data-table'

















const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<User>[] => [
  {
    accessorKey: 'last_name',
    header: 'Наименование',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'first_name',
    header: 'Наименование',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'middle_name',
    header: 'Наименование',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'avatar',
    header: 'Наименование',
    cell: (props) => (
      <Avatar className='h-8 w-8'>
        <AvatarImage src={props.getValue()} alt={props.row.original.first_name} />
        <AvatarFallback>{props.row.original.first_name}</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'is_disabled',
    header: 'Активный?',
    cell: (props) => {
      return (
        <div className='flex space-x-2'>
          <Badge
            variant='outline'
            className={cn(
              'capitalize',
              props.getValue() ? 'text-red-500' : 'text-green-500'
            )}
          >
            {props.getValue() ? 'Нет' : 'Да'}
          </Badge>
        </div>
      )
    }
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id: string = props.getValue()
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          <Link params={{ userId: id }} to='/users/$userId/edit'>
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

export function UsersTable() {
  const [users, setUsers] = useState<LaravelPaginatedResource<User> | null>(
    null
  )
  const [fetching, setFetching] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<string>('')

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Пользователь успешно удален')
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
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(1)
      setUsers(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
