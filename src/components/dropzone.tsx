import { useState } from 'react'
import { FileUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const val = bytes / Math.pow(k, i)
  return `${val.toFixed(val >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`
}

export function Dropzone({
  label,
  accept,
  file,
  onPick,
  hint,
  icon,
}: {
  label: string
  accept: string
  file?: File
  onPick: (f: File | null) => void
  hint?: string
  icon?: React.ReactNode
}) {
  const [dragOver, setDragOver] = useState(false)

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-medium'>{label}</p>
        {file ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='h-8 px-2 text-slate-500'
            onClick={() => onPick(null)}
          >
            <X className='mr-1 size-4' />
            Убрать
          </Button>
        ) : null}
      </div>

      <label
        className={[
          'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border bg-white p-6 text-center transition',
          dragOver
            ? 'border-primary/50 bg-primary/5'
            : 'border-slate-200 hover:bg-slate-50',
        ].join(' ')}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f) onPick(f)
        }}
      >
        <input
          type='file'
          accept={accept}
          className='hidden'
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        <div className='inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition group-hover:scale-[1.02]'>
          {icon ?? <FileUp className='size-5' />}
        </div>

        {file ? (
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-slate-900'>{file.name}</p>
            <p className='text-xs text-slate-500'>
              {formatBytes(file.size)} • {file.type || 'file'}
            </p>
          </div>
        ) : (
          <div className='space-y-1'>
            <p className='text-sm font-semibold text-slate-900'>
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className='text-xs text-slate-500'>
              {hint ?? `Форматы: ${accept}`}
            </p>
          </div>
        )}
      </label>
    </div>
  )
}
