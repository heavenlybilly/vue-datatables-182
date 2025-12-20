import type { RowItem, RowKey } from '../../types'

export const isRowKey = (value: unknown): value is RowKey =>
  typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value))

export const validateRowKeys = (
  items: readonly RowItem[],
  selector: (item: RowItem) => RowKey,
): void => {
  if (!Array.isArray(items)) {
    throw new Error('items must be an array')
  }

  const keys = new Set<RowKey>()

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index]

    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`items: row at index ${index} must be an object`)
    }

    const key = selector(item)

    if (!isRowKey(key)) {
      throw new Error(`rowKey: invalid key at index ${index}`)
    }

    if (keys.has(key)) {
      throw new Error(`rowKey: duplicate key at index ${index}: ${String(key)}`)
    }

    keys.add(key)
  }
}
