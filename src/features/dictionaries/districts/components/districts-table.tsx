import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type District } from '@/types/district'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/dictionaries/districts'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { AdminTableCard } from '@/components/admin/table-card'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<District>[] => [
  {
    accessorKey: 'name_ru',
    header: 'Наименование',
    cell: (props) => (
      <p className='font-medium'>{String(props.getValue() ?? '')}</p>
    ),
  },
  {
    accessorKey: 'name_tj',
    header: 'Ном',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'name_en',
    header: 'Name',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'region.name_ru',
    header: 'Регион',
    cell: (props) => <p>{String(props.getValue() ?? '')}</p>,
  },
  {
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'districts') ? (
            <Link
              params={{ districtId: id }}
              to='/dictionaries/districts/$districtId/edit'
              className='rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50'
            >
              <PenLine className='size-4' />
            </Link>
          ) : null}

          {ability.can('delete', 'districts') ? (
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

export const DistrictsTable = () => {
  const [districts, setDistricts] =
    useState<LaravelPaginatedResource<District> | null>(null)
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
      setDistricts(response)
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
      toast.success('Район успешно удален')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const columns = useMemo(() => getColumns({ deleting, onDelete }), [deleting])

  const table = useReactTable({
    data: districts?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: districts?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const currentPage = pagination.pageIndex + 1
  const totalPages = districts?.meta?.last_page ?? 1
  const total = districts?.meta?.total ?? 0
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
