import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

type AdminIndexPageProps = {
  title: string
  subtitle?: string
  createLabel?: string
  canCreate?: boolean
  onCreate?: () => void
  filters?: React.ReactNode
  children: React.ReactNode
}

export function AdminIndexPage({
  title,
  subtitle,
  createLabel = 'Создать',
  canCreate = false,
  onCreate,
  filters,
  children,
}: AdminIndexPageProps) {
  return (
    <Main className='flex flex-1 flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-semibold tracking-tight text-slate-900'>
            {title}
          </h1>

          {subtitle ? (
            <p className='text-sm text-slate-500'>{subtitle}</p>
          ) : null}
        </div>

        {canCreate && onCreate ? (
          <Button
            onClick={onCreate}
            className='flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700'
          >
            <Plus className='size-4' />
            {createLabel}
          </Button>
        ) : null}
      </div>

      {/* Filters */}
      {filters ? (
        <div className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm'>
          {filters}
        </div>
      ) : null}

      {/* Content */}
      {children}
    </Main>
  )
}
