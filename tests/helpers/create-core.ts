import { vi } from 'vitest'
import { useColumnRegistry } from '../../src/components/columns/useColumnRegistry'
import { useCore } from '../../src/components/core/useCore'
import type { DataTableProps } from '../../src/types'

export const createCore = (props: DataTableProps = { rowKey: 'id' }) => {
  const columnRegistry = useColumnRegistry()
  const emit = vi.fn()
  const core = useCore({
    columnRegistry,
    emit,
    props,
  })
  core.normalize()
  return { core, columnRegistry, emit }
}
