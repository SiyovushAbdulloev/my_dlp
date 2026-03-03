// src/features/users/components/users-table.tsx
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type EducationDepartment } from '@/types/education_department.ts'
import { type HeadDirectorate } from '@/types/head_directorate.ts'
import { type User } from '@/types/user'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/users'
import { Badge } from '@/components/ui/badge'
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

function getFullName(u: User) {
  return [u.last_name, u.first_name, u.middle_name].filter(Boolean).join(' ')
}

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<User>[] => [
  {
    accessorKey: 'head_directorate_id',
    header: 'Сарраёсат',
    cell: (props) => {
      const v = props.getValue() as HeadDirectorate | null
      return v ? (
        <Badge variant='secondary'>{v.name_ru}</Badge>
      ) : (
        <span className='text-slate-400'>—</span>
      )
    },
  },
  {
    accessorKey: 'education_department_id',
    header: 'Отдел',
    cell: (props) => {
      const v = props.getValue() as EducationDepartment | null
      return v ? (
        <Badge variant='outline'>{v.name_ru}</Badge>
      ) : (
        <span className='text-slate-400'>—</span>
      )
    },
  },
  {
    id: 'full_name',
    header: 'ФИО',
    cell: ({ row }) => (
      <div className='min-w-[220px]'>
        <p className='font-medium text-slate-900'>
          {getFullName(row.original)}
        </p>
        <p className='text-xs text-slate-500'>{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'birthdate',
    header: 'Дата рождения',
    cell: (props) => <p>{String(props.getValue() ?? '—')}</p>,
  },
  {
    accessorKey: 'education',
    header: 'Образование',
    cell: (props) => (
      <p className='max-w-[260px] truncate'>
        {String(props.getValue() ?? '—')}
      </p>
    ),
  },
  {
    accessorKey: 'university',
    header: 'Университет',
    cell: (props) => (
      <p className='max-w-[260px] truncate'>
        {String(props.getValue() ?? '—')}
      </p>
    ),
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          <Link
            params={{ userId: id }}
            to='/users/$userId/edit'
            className='text-slate-500 hover:text-primary'
          >
            <PenLine className='size-5' />
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
              <Trash className='size-5' />
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
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState<string>('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(pagination.pageIndex + 1)
      setUsers(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const columns = useMemo(() => getColumns({ deleting, onDelete }), [deleting])

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
      <div className='relative mb-4 overflow-hidden rounded-2xl border bg-white'>
        {fetching ? (
          <span className='absolute inset-0 z-10 flex items-center justify-center bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </span>
        ) : null}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} colSpan={h.colSpan}>
                    {h.column.columnDef.header as ReactNode}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
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
