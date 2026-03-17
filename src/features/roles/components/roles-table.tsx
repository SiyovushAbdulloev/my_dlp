import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Role } from '@/types'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchAll } from '@/api/roles'
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

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<Role>[] => [
  {
    accessorKey: 'description',
    header: 'Наименование',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
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
      const id: string = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'roles') ? (
            <Link params={{ roleId: id }} to='/roles/$roleId/edit'>
              <PenLine className={'size-5'} />
            </Link>
          ) : null}

          {!props.row.original.is_systemic ? (
            <>
              {ability.can('delete', 'roles') ? (
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
            </>
          ) : null}
        </div>
      )
    },
  },
]

export const RolesTable = () => {
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [fetching, setFetching] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<string>('')

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

  const columns = useMemo(() => {
    return getColumns({ deleting, onDelete })
  }, [deleting])

  const table = useReactTable({
    data: roles ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

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
    </div>
  )
}
