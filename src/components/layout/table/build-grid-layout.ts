import { stickyWidth } from '../../columns/sticky-width'
import type { ColumnDef, ColumnKey } from '../../columns/types'
import { Sticky } from '../../types'

type StickyOffsets = Partial<
  Record<
    ColumnKey,
    {
      left?: string
      right?: string
    }
  >
>

export type GridLayoutStyle = {
  display: 'grid'
  gridTemplateColumns: string
}

export type GridLayout<RowItem> = {
  stickyEdges: Partial<Record<ColumnKey, 'left' | 'right'>>
  stickyOffsets: StickyOffsets
  orderedColumns: ColumnDef<RowItem>[]
  gridStyle: GridLayoutStyle
}

export const buildGridLayout = <RowItem>(
  columns: readonly ColumnDef<RowItem>[],
  scrollX: boolean,
): GridLayout<RowItem> => {
  const left = columns.filter((column) => column.sticky === Sticky.LEFT)
  const right = columns.filter((column) => column.sticky === Sticky.RIGHT)
  const normal = columns.filter((column) => !column.sticky)
  const orderedColumns = [...left, ...normal, ...right]
  const stickyOffsets: StickyOffsets = {}
  let leftOffset = 0

  left.forEach((column) => {
    stickyOffsets[column.key] = {
      left: `${leftOffset}px`,
    }
    leftOffset += stickyWidth(column.width, column.key)
  })

  let rightOffset = 0

  right
    .slice()
    .reverse()
    .forEach((column) => {
      stickyOffsets[column.key] = {
        right: `${rightOffset}px`,
      }
      rightOffset += stickyWidth(column.width, column.key)
    })

  return {
    orderedColumns,
    stickyOffsets,
    stickyEdges: {
      ...(left.length
        ? {
            [left[left.length - 1].key]: 'left' as const,
          }
        : {}),
      ...(right.length
        ? {
            [right[0].key]: 'right' as const,
          }
        : {}),
    },
    gridStyle: {
      display: 'grid',
      gridTemplateColumns: orderedColumns
        .map((column) => column.width?.trim() || (scrollX ? 'max-content' : 'minmax(0, 1fr)'))
        .join(' '),
    },
  }
}
