// src/components/async-combobox/async-combobox.tsx
import * as React from 'react'
import { type LaravelPaginatedResource } from 'laravel-resource-pagination-type'
import { Check, ChevronDown, Loader } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type ComboboxProps<T> = {
  value: string | undefined
  onChange: (value: string) => void

  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string

  disabled?: boolean
  className?: string

  load: (args: {
    q: string
    page: number
  }) => Promise<LaravelPaginatedResource<T>>
  getValue: (item: T) => string
  getLabel: (item: T) => string

  // optional cache
  initialItems?: T[]
  debounceMs?: number

  // ✅ show selected item immediately (for edit pages, prefilled forms, etc.)
  // Pass either initialSelected (preferred) or selectedLabel (fallback).
  initialSelected?: T
  selectedLabel?: string
}

export function Combobox<T>({
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'Nothing found.',
  disabled,
  className,
  load,
  getValue,
  getLabel,
  initialItems = [],
  debounceMs = 300,
  initialSelected,
  selectedLabel,
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [q, setQ] = React.useState('')
  const [items, setItems] = React.useState<T[]>(initialItems)
  const [page, setPage] = React.useState(1)
  const [lastPage, setLastPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [loadingMore, setLoadingMore] = React.useState(false)

  const listRef = React.useRef<HTMLDivElement | null>(null)
  const sentinelRef = React.useRef<HTMLDivElement | null>(null)

  // ✅ ensure initialSelected is present in items so label can be resolved
  React.useEffect(() => {
    if (!initialSelected) return
    if (!value) return

    const initVal = getValue(initialSelected)
    if (!initVal) return
    if (initVal !== value) return

    setItems((prev) => {
      const exists = prev.some((i) => getValue(i) === initVal)
      return exists ? prev : [initialSelected, ...prev]
    })
  }, [initialSelected, value, getValue])

  const selected = React.useMemo(() => {
    if (!value) return null
    return items.find((i) => getValue(i) === value) ?? null
  }, [value, items, getValue])

  const hasMore = page < lastPage

  const fetchPage = React.useCallback(
    async (args: { q: string; page: number; append: boolean }) => {
      const { q, page, append } = args
      console.log({ q, page, append })
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        append ? setLoadingMore(true) : setLoading(true)

        const res = await load({ q, page })
        const newItems = res.data ?? []

        setItems((prev) => (append ? [...prev, ...newItems] : newItems))
        setPage(res.meta?.current_page ?? page)
        setLastPage(res.meta?.last_page ?? 1)
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        append ? setLoadingMore(false) : setLoading(false)
      }
    },
    [load]
  )

  // Debounce search (server-side)
  React.useEffect(() => {
    if (!open) return

    const t = window.setTimeout(() => {
      fetchPage({ q, page: 1, append: false })
    }, debounceMs)

    return () => window.clearTimeout(t)
  }, [q, open, debounceMs, fetchPage])

  // First open load (only if list is empty)
  React.useEffect(() => {
    if (!open) return
    if (items.length > 0) return
    fetchPage({ q: '', page: 1, append: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Infinite scroll via IntersectionObserver
  React.useEffect(() => {
    if (!open) return
    if (!sentinelRef.current) return
    if (!listRef.current) return

    const root = listRef.current
    const el = sentinelRef.current

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first?.isIntersecting) return
        if (loading || loadingMore) return
        if (!hasMore) return
        fetchPage({ q, page: page + 1, append: true })
      },
      { root, rootMargin: '100px', threshold: 0.1 }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [open, hasMore, page, q, loading, loadingMore, fetchPage])

  // ✅ label logic: prefer selected from items, fallback to selectedLabel
  const label = selected ? getLabel(selected) : (selectedLabel ?? '')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          disabled={disabled}
          className={cn('w-full justify-between', className)}
        >
          <span className={cn('truncate', !label && 'text-muted-foreground')}>
            {label || placeholder}
          </span>
          <ChevronDown className='ml-2 size-4 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-[var(--radix-popover-trigger-width)] p-0'
        align='start'
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={q}
            onValueChange={setQ}
            placeholder={searchPlaceholder}
          />

          <CommandList ref={listRef} className='max-h-64 overflow-auto'>
            {loading ? (
              <div className='flex h-14 items-center justify-center gap-2 text-sm'>
                <Loader className='size-4 animate-spin' />
                Загружается...
              </div>
            ) : null}

            {!loading && items.length === 0 ? (
              <CommandEmpty>{emptyText}</CommandEmpty>
            ) : null}

            <CommandGroup>
              {items.map((item) => {
                const v = getValue(item)
                const isSelected = v === value

                return (
                  <CommandItem
                    key={v}
                    value={v}
                    onSelect={() => {
                      onChange(v)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        isSelected ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {getLabel(item)}
                  </CommandItem>
                )
              })}

              {/* sentinel */}
              <div ref={sentinelRef} />

              {loadingMore ? (
                <div className='flex h-12 items-center justify-center gap-2 text-sm'>
                  <Loader className='size-4 animate-spin' />
                  Загружается...
                </div>
              ) : null}

              {!loading && !loadingMore && items.length > 0 && !hasMore ? (
                <div className='px-3 py-2 text-xs text-muted-foreground'>
                  Конец списка
                </div>
              ) : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
