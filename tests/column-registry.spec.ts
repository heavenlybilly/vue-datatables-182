import { describe, expect, it } from 'vitest'
import { Fragment, h } from 'vue'
import type { VNode } from 'vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import { normalizeSlotResult } from '../src/components/columns/normalize-slot-result'
import { useColumnRegistry } from '../src/components/columns/useColumnRegistry'

const field = (props: Record<string, unknown> = {}) =>
  h(DataTableColumn, { field: 'name', ...props })
const rebuild = (registry: ReturnType<typeof useColumnRegistry>, nodes: VNode[], extras = {}) =>
  registry.rebuild({ slots: { default: () => nodes }, tableProps: { rowKey: 'id', ...extras } })

describe('column registry validation', () => {
  it('recursively flattens nested Fragment and normalizes bindings without changing VNode props', () => {
    const node = field({
      key: 'name',
      'sort-field': 'server_name',
      'text-align': 'right',
      sortable: '',
      searchable: false,
      class: ['one', { two: true, ignored: false }],
    })
    Object.freeze(node.props)
    const result = normalizeSlotResult([
      h(Fragment, {}, [h(Fragment, {}, [node]), h('span', 'ignored')]),
    ])
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      columnKey: 'name',
      className: 'one two',
      tableColumnProps: {
        sortField: 'server_name',
        textAlign: 'right',
        sortable: true,
        searchable: false,
      },
    })
    expect(node.props).toHaveProperty('sort-field', 'server_name')
    expect(node.props).not.toHaveProperty('sortField')
  })

  it.each([
    [{ key: '' }, 'Column key'],
    [{ key: 1 }, 'Column key'],
    [{ key: '_internal:user' }, 'reserved'],
    [{ field: undefined }, 'field, value or cell-slot'],
    [{ field: undefined, value: () => 1 }, 'explicit key'],
    [{ sticky: 'left', width: '10%' }, 'fixed px'],
    [{ sticky: 'left', width: '0px' }, 'fixed px'],
    [{ sticky: 'left', width: 'calc(10px + 2px)' }, 'fixed px'],
    [{ sticky: 'top' }, 'sticky'],
    [{ 'text-align': 'justify' }, 'textAlign'],
    [{ searchable: 'false' }, 'boolean'],
    [{ value: 1 }, 'function'],
  ])('rejects invalid configuration and preserves the previous registry: %j', (props, message) => {
    const registry = useColumnRegistry()
    rebuild(registry, [field()])
    const previous = registry.columns
    const revision = registry.dataRevision
    expect(() => rebuild(registry, [field(props as Record<string, unknown>)])).toThrow(
      message as string,
    )
    expect(registry.columns).toBe(previous)
    expect(registry.dataRevision).toBe(revision)
    rebuild(registry, [field()])
    expect(registry.columns).toBe(previous)
  })

  it('does not partially commit duplicates and can recover with the same valid keys', () => {
    const registry = useColumnRegistry()
    rebuild(registry, [field({ title: 'Old' })])
    const previous = registry.columns
    expect(() => rebuild(registry, [field({ title: 'New' }), field()])).toThrow('Duplicate')
    expect(registry.columns).toBe(previous)
    rebuild(registry, [field({ title: 'Recovered' })])
    expect(registry.columns[0].title).toBe('Recovered')
  })

  it('uses current left-sticky columns to pin internal columns and removes pinning reactively', () => {
    const registry = useColumnRegistry()
    rebuild(registry, [field({ sticky: 'left', width: '100.5px' })], {
      selection: true,
      numbering: true,
    })
    expect(registry.columns.slice(0, 2).map((column) => column.sticky)).toEqual(['left', 'left'])
    rebuild(registry, [field()], { selection: true, numbering: true })
    expect(registry.columns.every((column) => column.sticky === undefined)).toBe(true)
  })

  it('updates appearance and slots without incrementing processing revision', () => {
    const registry = useColumnRegistry()
    rebuild(registry, [field()])
    const revision = registry.dataRevision
    rebuild(registry, [field({ title: 'New', width: '120px', class: 'custom' })], {
      selection: true,
    })
    expect(registry.columns.at(-1)).toMatchObject({
      title: 'New',
      width: '120px',
      className: 'custom',
    })
    expect(registry.dataRevision).toBe(revision)
    rebuild(registry, [h(DataTableColumn, { field: 'name' }, { cell: () => [h('span')] })])
    expect(registry.dataRevision).toBe(revision)
    rebuild(registry, [field({ searchable: true })])
    expect(registry.dataRevision).toBe(revision + 1)
  })
})
