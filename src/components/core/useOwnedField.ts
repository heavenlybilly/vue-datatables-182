import { shallowRef } from 'vue'
import type { ShallowRef } from 'vue'

type OwnedField<T> = {
  value: ShallowRef<T>
  sync: (proposeNormalization?: boolean) => void
  request: (next: T) => boolean
  constrain: (next: T) => void
}

export const useOwnedField = <T>(options: {
  read: () => T | undefined
  initial: T
  normalize: (value: T) => T
  equal?: (left: T, right: T) => boolean
  emit: (value: T) => void
}): OwnedField<T> => {
  const controlled = options.read() !== undefined
  const equal = options.equal ?? Object.is

  const copy = (input: T): T => {
    if (Array.isArray(input)) {
      return [...input] as T
    }

    if (input && typeof input === 'object') {
      return {
        ...input,
      }
    }

    return input
  }

  const read = () => (options.read() === undefined ? options.initial : (options.read() as T))

  let input = copy(read())
  let correction: T | undefined
  let hasCorrection = false
  const value = shallowRef<T>(options.normalize(input))

  const constrain = (next: T) => {
    if (equal(value.value, next) && equal(input, next)) {
      return
    }

    if (!equal(value.value, next)) {
      value.value = next
    }

    if (!controlled) {
      input = copy(next)
    }

    if (!hasCorrection || !equal(correction as T, next)) {
      options.emit(next)
      correction = next
      hasCorrection = true
    }
  }

  const sync = (proposeNormalization = true) => {
    if (controlled) {
      const next = read()

      if (!equal(input, next)) {
        input = copy(next)
        value.value = options.normalize(next)
        hasCorrection = false
      }
    }

    const normalized = options.normalize(input)

    if (proposeNormalization && !equal(input, normalized)) {
      constrain(normalized)
    }
  }

  const request = (next: T) => {
    if (equal(value.value, next)) {
      return false
    }

    options.emit(next)

    if (controlled) {
      return false
    }

    value.value = next
    input = copy(next)
    hasCorrection = false

    return true
  }

  return {
    value,
    sync,
    request,
    constrain,
  }
}
