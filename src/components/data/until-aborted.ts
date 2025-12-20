export const untilAborted = <T>(work: Promise<T>, signal: AbortSignal): Promise<T | undefined> => {
  return new Promise<T | undefined>((resolve, reject) => {
    const abort = () => resolve(undefined)

    if (signal.aborted) {
      abort()
    } else {
      signal.addEventListener('abort', abort, {
        once: true,
      })
    }

    work.then(
      (value) => {
        signal.removeEventListener('abort', abort)
        resolve(value)
      },
      (error: unknown) => {
        signal.removeEventListener('abort', abort)
        reject(error)
      },
    )
  })
}
