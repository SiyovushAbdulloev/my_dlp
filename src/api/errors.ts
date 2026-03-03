export class ValidationError extends Error {
  status = 422 as const
  errors: Record<string, string[]>

  constructor(message: string, errors: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors
  }
}
