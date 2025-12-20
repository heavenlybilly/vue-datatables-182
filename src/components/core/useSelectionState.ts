import { computed } from 'vue'
import type { RowItem, RowKey, TableData } from '../../types'
import { makeRowKeySelector } from './helpers'
import { isRowKey } from './row-keys'
import { equalKeys } from './state-normalization'
import type { CoreOptions } from './types'
import { useOwnedField } from './useOwnedField'

export const useSelectionState = (
  { props, emit }: CoreOptions,
  getData: () => TableData,
  hasData: () => boolean,
  canInteract: () => boolean,
) => {
  const selector = computed(() => makeRowKeySelector(props.rowKey))
  const limit = computed(() => {
    const value = props.selectionLimit === undefined ? 1000 : props.selectionLimit

    if (value !== null && (!Number.isInteger(value) || value < 0)) {
      throw new Error('selectionLimit must be a non-negative integer or null')
    }

    return value
  })
  const selected = useOwnedField<readonly RowKey[]>({
    read: () => props.selectedRowKeys,
    initial: [...(props.defaultSelectedRowKeys ?? [])],
    normalize: (keys) => [...new Set(keys.filter(isRowKey))],
    equal: equalKeys,
    emit: (keys) => emit('update:selectedRowKeys', [...keys]),
  })
  let notified: readonly RowKey[] = []

  const notify = () => {
    const keys = selected.value.value

    if (equalKeys(keys, notified)) {
      return
    }

    notified = [...keys]

    const itemsByKey = new Map(getData().items.map((item) => [selector.value(item), item]))
    const items = keys.flatMap((key) => {
      const item = itemsByKey.get(key)

      return item ? [item] : []
    })

    emit('selectionChange', {
      keys: [...keys],
      items,
    })
  }

  let pendingClear = false

  const normalize = (clear = false) => {
    let keys = clear || pendingClear ? [] : [...selected.value.value]

    pendingClear = false

    if (!props.selection) {
      keys = []
    }

    if (hasData()) {
      const visible = new Set(getData().items.map(selector.value))

      keys = keys.filter((key) => visible.has(key))
    }

    if (limit.value !== null) {
      keys = keys.slice(0, limit.value)
    }

    selected.constrain(keys)

    if (hasData() || !props.selection) {
      notify()
    }
  }

  const sync = (clear = false, deferData = false) => {
    pendingClear = pendingClear || clear
    selected.sync(false)

    if (!deferData) {
      normalize()
    }
  }

  const clear = (force = false) => {
    if (force) {
      selected.constrain([])
    } else {
      selected.request([])
    }

    notify()
  }

  const toggle = (item: RowItem) => {
    if (!props.selection || !canInteract()) {
      return
    }

    const key = selector.value(item)

    if (!getData().items.some((row) => selector.value(row) === key)) {
      return
    }

    const keys = [...selected.value.value]
    const index = keys.indexOf(key)

    if (index >= 0) {
      keys.splice(index, 1)
    } else {
      if (limit.value !== null && keys.length >= limit.value) {
        return
      }

      keys.push(key)
    }

    selected.request(keys)
    notify()
  }

  const selectAll = () => {
    if (!props.selection || !canInteract() || props.allowSelectAll === false) {
      return
    }

    const keys = [...new Set(getData().items.map(selector.value))]

    selected.request(limit.value === null ? keys : keys.slice(0, limit.value))
    notify()
  }

  return {
    selected,
    selector,
    limit,
    normalize,
    sync,
    clear,
    toggle,
    selectAll,
  }
}
