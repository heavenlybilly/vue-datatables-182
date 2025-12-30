import { ColumnDef, ColumnKey } from '../../columns/types'
import { Sticky } from '../../types'

type StickyOffsets = Partial<Record<ColumnKey, { left?: string; right?: string }>>

export type GridLayoutStyle = {
  display: 'grid'
  gridTemplateColumns: string
}

export type GridLayout<RowItem> = {
  stickyOffsets: StickyOffsets
  orderedColumns: ColumnDef<RowItem>[]
  gridStyle: GridLayoutStyle
}

const calcSum = (parts: string[]) => {
  if (parts.length === 0) return '0'
  if (parts.length === 1) return parts[0]

  return `calc(${parts.join(' + ')})`
}

export const buildGridLayout = <RowItem>(
  columns: ReadonlyArray<ColumnDef<RowItem>>,
  scrollX: boolean,
): GridLayout<RowItem> => {
  const noWidthTrack = scrollX ? 'max-content' : 'minmax(0, 1fr)'

  const left: ColumnDef<RowItem>[] = []
  const normal: ColumnDef<RowItem>[] = []
  const right: ColumnDef<RowItem>[] = []

  columns.forEach((column) => {
    if (column.sticky === Sticky.LEFT) left.push(column)
    else if (column.sticky === Sticky.RIGHT) right.push(column)
    else normal.push(column)
  })

  const orderedColumns = [...left, ...normal, ...right]

  const gridTemplateColumns = orderedColumns
    .map((column) => {
      return column.width && column.width.trim() ? column.width.trim() : noWidthTrack
    })
    .join(' ')

  const stickyOffsets: StickyOffsets = {}

  // left offset
  const leftAcc: string[] = []
  for (let i = 0; i < left.length; i += 1) {
    const column = left[i]

    if (!column.width || column.width.trim().length === 0) {
      throw new Error(`Sticky column must have width. ColumnKey is "${String(column.key)}".`)
    }

    stickyOffsets[column.key] = { left: calcSum(leftAcc) }
    leftAcc.push(column.width)
  }

  // right offset
  const rightAcc: string[] = []
  for (let i = right.length - 1; i >= 0; i -= 1) {
    const column = right[i]

    if (!column.width || column.width.trim().length === 0) {
      throw new Error(`Sticky column must have width. ColumnKey is "${String(column.key)}".`)
    }

    stickyOffsets[column.key] = { right: calcSum(rightAcc) }
    rightAcc.push(column.width)
  }

  return {
    stickyOffsets,
    orderedColumns,
    gridStyle: {
      display: 'grid',
      gridTemplateColumns,
    },
  }
}
