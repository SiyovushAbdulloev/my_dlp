import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Role } from '@/types'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchAll } from '@/api/roles'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminTableCard } from '@/components/admin/table-card'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<Role>[] => [
  {
    accessorKey: 'description',
    header: 'Наименование',
    cell: (props) => (
      <p className='font-medium'>{String(props.getValue() ?? '')}</p>
    ),
  },
  {
    accessorKey: 'is_systemic',
    header: 'Системная',
    cell: (props) => <p>{props.getValue() ? 'Да' : 'Нет'}</p>,
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'roles') ? (
            <Link
              params={{ roleId: id }}
              to='/roles/$roleId/edit'
              className='rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50'
            >
              <PenLine className='size-4' />
            </Link>
          ) : null}

          {!props.row.original.is_systemic && ability.can('delete', 'roles') ? (
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

export const RolesTable = () => {
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchAll()
      setRoles(response.data)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Роль успешно удалена')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const columns = useMemo(() => getColumns({ deleting, onDelete }), [deleting])

  const table = useReactTable({
    data: roles ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const total = roles?.length ?? 0
  const currentRowsCount = table.getRowModel().rows.length

  return (
    <AdminTableCard
      fetching={fetching}
      table={table}
      columnsLength={columns.length}
      start={total === 0 ? 0 : 1}
      end={currentRowsCount}
      total={total}
      currentPage={1}
      totalPages={1}
      onPrevPage={() => {}}
      onNextPage={() => {}}
    />
  )
}
