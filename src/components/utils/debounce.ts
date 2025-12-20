type DebouncedFunction<T extends (...args: any[]) => any> = {
  (...args: Parameters<T>): void
  cancel: () => void
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false,
): DebouncedFunction<T> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = function schedule(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null

      if (!immediate) {
        func.apply(this, args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

export default debounce
