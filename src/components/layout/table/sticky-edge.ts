import type { ColumnKey } from '../../columns/types'
import type { GridLayout } from './build-grid-layout'

export const stickyEdge = <T>(key: ColumnKey, layout: GridLayout<T>) => ({
  'dt182-sticky-edge-left': layout.stickyEdges[key] === 'left',
  'dt182-sticky-edge-right': layout.stickyEdges[key] === 'right',
})
