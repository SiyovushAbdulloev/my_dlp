import * as React from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  ref?: React.Ref<HTMLInputElement>
}

export function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className={cn('relative', className)}>
      <Lock className='pointer-events-none absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 text-slate-400' />

      <input
        type={showPassword ? 'text' : 'password'}
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pr-11 pl-11 text-sm text-slate-900 shadow-sm transition-[color,box-shadow,border-color] outline-none',
          'placeholder:text-slate-400',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/10',
          'aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/10'
        )}
        {...props}
      />

      <button
        type='button'
        disabled={disabled}
        className='absolute top-1/2 right-3 z-10 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:pointer-events-none'
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className='size-5' />
        ) : (
          <Eye className='size-5' />
        )}
      </button>
    </div>
  )
}
