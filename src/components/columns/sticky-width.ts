export const stickyWidth = (width: string | undefined, key: string): number => {
  const value = width?.trim()
  const pixels = value && /^(?:\d+(?:\.\d+)?|\.\d+)px$/.test(value) ? Number.parseFloat(value) : NaN

  if (!Number.isFinite(pixels) || pixels <= 0) {
    throw new Error(`Sticky column must have width in positive fixed px: ${key}`)
  }

  return pixels
}
