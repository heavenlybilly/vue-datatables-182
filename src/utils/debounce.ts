type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false,
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  // eslint-disable-next-line func-names
  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(context, args)
    }
  }
}

export default debounce
