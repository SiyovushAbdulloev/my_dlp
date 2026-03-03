import type { FieldValues, UseFormReturn, Path } from 'react-hook-form'
import { ValidationError } from '@/api/errors'

export function applyValidationErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  err: unknown,
  map?: Record<string, Path<T>>
): boolean {
  if (!(err instanceof ValidationError)) return false

  const errors = err.errors ?? {}

  for (const [key, messages] of Object.entries(errors)) {
    const field = map?.[key] ?? (key as Path<T>)
    form.setError(field, {
      type: 'server',
      message: messages?.[0] ?? 'Invalid value',
    })
  }

  return true
}
