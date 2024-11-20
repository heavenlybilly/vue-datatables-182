export class DomainError extends Error {
  description: string | null

  constructor(message: string, description: string | null = null) {
    super(message)
    this.description = description
    this.name = 'DomainError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DomainError)
    }
  }
}
