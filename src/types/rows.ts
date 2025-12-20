export type RowValue = any

export type RowItem = Record<string, RowValue>

export type RowKey = string | number

export type RowKeySelector<T> = (keyof T & string) | ((item: T) => RowKey)

export type TableData<T = RowItem> = {
  items: T[]
  total: number
  filtered: number
}
