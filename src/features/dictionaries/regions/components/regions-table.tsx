import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Region } from '@/types'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { LoaderCircle, PenLine, Search, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { deleteById, fetchIndex } from '@/api/dictionaries/regions'
import { ability } from '@/lib/casl/ability'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AdminTableCard } from '@/components/admin/table-card.tsx'

const getColumns = (opts: {
  deleting: string | null
  onDelete: (id: string) => void
}): ColumnDef<Region>[] => [
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
    accessorKey: 'id',
    header: 'Действие',
    cell: (props) => {
      const id: string = props.getValue() as string
      const isDeleting = opts.deleting === id

      return (
        <div className='flex items-center gap-2'>
          {ability.can('edit', 'regions') ? (
            <Link
              params={{ regionId: id }}
              to='/dictionaries/regions/$regionId/edit'
              className='rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50'
            >
              <PenLine className='size-4' />
            </Link>
          ) : null}

          {ability.can('delete', 'regions') ? (
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

export const RegionsTable = () => {
  const [regions, setRegions] =
    useState<LaravelPaginatedResource<Region> | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim())
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }))
    }, 700)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  const fetchData = async () => {
    try {
      setFetching(true)
      const response = await fetchIndex(
        pagination.pageIndex + 1,
        debouncedQuery
      )
      setRegions(response)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [pagination.pageIndex, debouncedQuery])

  const onDelete = async (id: string) => {
    try {
      setDeleting(id)
      await deleteById(id)
      toast.success('Регион успешно удален')
      await fetchData()
    } finally {
      setDeleting('')
    }
  }

  const columns = useMemo(() => {
    return getColumns({ deleting, onDelete })
  }, [deleting])

  const table = useReactTable({
    data: regions?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: regions?.meta?.last_page ?? 1,
    manualPagination: true,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  })

  const currentPage = pagination.pageIndex + 1
  const totalPages = regions?.meta?.last_page ?? 1
  const total = regions?.meta?.total ?? 0
  const currentRowsCount = table.getRowModel().rows.length
  const start = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const end = total === 0 ? 0 : start + currentRowsCount - 1

  return (
    <div className='space-y-6'>
      <div className='relative'>
        <Search className='absolute top-1/2 left-3 size-5 -translate-y-1/2 text-slate-400' />
        <Input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Поиск'
          className='pl-10'
        />
      </div>

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
    </div>
  )
}
