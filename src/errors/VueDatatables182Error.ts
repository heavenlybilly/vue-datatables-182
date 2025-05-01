export class VueDatatables182Error extends Error {
  description: string | null

  constructor(message: string, description: string | null = null) {
    super(message)
    this.description = description
    this.name = 'VueDatatables182Error'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VueDatatables182Error)
    }
  }
}
