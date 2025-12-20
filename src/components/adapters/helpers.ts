export const formatSearchString = (v: unknown): string => {
  if (v === null || v === undefined) {
    return ''
  }

  return String(v).toLowerCase()
}
