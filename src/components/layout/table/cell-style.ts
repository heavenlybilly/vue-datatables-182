import type { CSSProperties } from 'vue'
import type { ColumnDef } from '../../columns/types'
import type { GridLayout } from './build-grid-layout'

export const cellStyle = <T>(
  column: ColumnDef<T>,
  layout: GridLayout<T>,
  stickyHeader = false,
): CSSProperties => {
  const offset = layout.stickyOffsets[column.key]

  return {
    textAlign: column.textAlign ?? 'left',
    ...(offset || stickyHeader
      ? {
          position: 'sticky',
        }
      : {}),
    ...offset,
    ...(stickyHeader
      ? {
          top: '0px',
          zIndex: offset ? 4 : 3,
        }
      : {}),
  }
}
