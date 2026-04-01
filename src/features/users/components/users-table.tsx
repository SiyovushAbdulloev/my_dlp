import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type User } from '@/types/user'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/users'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminTableCard } from '@/components/admin/table-card'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<User>[] => [
  {
    accessorKey: 'last_name',
    header: 'Фамилия',
    cell: (props) => (
      <p className='font-medium'>{String(props.getValue() ?? '')}</p>
    ),
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
            <Link
              params={{ userId: id }}
              to='/users/$userId/edit'
              className='rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50'
            >
              <PenLine className='size-4' />
            </Link>
          ) : null}

          {ability.can('delete', 'users') ? (
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

export function UsersTable() {
  const [users, setUsers] = useState<LaravelPaginatedResource<User> | null>(
    null
  )
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

  const currentPage = pagination.pageIndex + 1
  const totalPages = users?.meta?.last_page ?? 1
  const total = users?.meta?.total ?? 0
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
