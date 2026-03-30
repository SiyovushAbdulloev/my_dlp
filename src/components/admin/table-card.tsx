import type { ReactNode } from 'react'
import {
  flexRender,
  type HeaderGroup,
  type Table as TanstackTable,
} from '@tanstack/react-table'
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type AdminTableCardProps<TData> = {
  fetching?: boolean
  emptyText?: string

  start: number
  end: number
  total: number
  currentPage: number
  totalPages: number

  onPrevPage: () => void
  onNextPage: () => void

  table: TanstackTable<TData>
  columnsLength: number
}

export function AdminTableCard<TData>({
  fetching = false,
  start,
  end,
  total,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  table,
  columnsLength,
  emptyText = 'Пусто.',
}: AdminTableCardProps<TData>) {
  const hasRows = table.getRowModel().rows?.length > 0

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'>
        {fetching ? (
          <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/70'>
            <LoaderCircle className='size-10 animate-spin' />
          </div>
        ) : null}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
              <TableRow
                key={headerGroup.id}
                className='bg-slate-50 hover:bg-slate-50'
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className='h-12 font-medium text-slate-600'
                  >
                    {header.isPlaceholder
                      ? null
                      : (header.column.columnDef.header as ReactNode)}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {hasRows ? (
              table.getRowModel().rows.map((rowModel) => (
                <TableRow
                  key={rowModel.id}
                  className='border-t border-slate-100 hover:bg-slate-50'
                >
                  {rowModel.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-4 align-middle'>
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
                  colSpan={columnsLength}
                  className='h-24 text-center text-slate-500'
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between'>
        <p className='text-sm text-slate-600'>
          Показано {start} - {end} из {total}
        </p>

        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={onPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='size-4' />
          </Button>

          <span className='text-sm text-slate-600'>
            Страница {currentPage} из {totalPages}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
