import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive, ref } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import type { DataTableColumnProps, RowItem } from '../src/types'
import { Source } from '../src/types'
import { mockFetch } from './helpers/remote-table'

const items = [
  { id: 1, name: 'A', other: 'B' },
  { id: 2, name: 'B', other: 'A' },
]

describe('dynamic column metadata', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('reacts to searchable, field, value and sortable with stable keys', async () => {
    const column = reactive<DataTableColumnProps>({
      field: 'name',
      searchable: true,
      sortable: true,
    })
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items,
        defaultSearchQuery: 'A',
        defaultSort: { by: 'name', direction: 'asc' },
      },
      slots: { default: () => [h(DataTableColumn, { key: 'name', ...column })] },
    })
    await nextTick()
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.tableData.items.map((item: RowItem) => item.id)).toEqual([1])
    column.field = 'other'
    await nextTick()
    expect(controller.state.tableData.items.map((item: RowItem) => item.id)).toEqual([2])
    column.value = (row: unknown) => (row as RowItem).name
    await nextTick()
    expect(controller.state.tableData.items.map((item: RowItem) => item.id)).toEqual([1])
    column.searchable = false
    await nextTick()
    expect(controller.state.tableData.items).toHaveLength(2)
    column.sortable = false
    await nextTick()
    expect(controller.state.sort.by).toBeNull()
    expect(wrapper.emitted('update:sort')).toEqual([[null]])
    wrapper.unmount()
  })

  it('updates title, width, classes, alignment and cell-slot without processing offscreen rows', async () => {
    const column = reactive({
      title: 'Old',
      width: '100px',
      class: 'old',
      textAlign: 'left' as const,
    })
    const formatted = ref(false)
    const value = vi.fn((row: unknown) => (row as RowItem).name)
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items,
        defaultRowsPerPageCount: 1,
        defaultSearchQuery: 'A',
      },
      slots: {
        default: () => [
          h(
            DataTableColumn,
            { key: 'name', ...column, value, searchable: true },
            formatted.value ? { cell: () => [h('strong', 'Slot')] } : undefined,
          ),
        ],
      },
    })
    await nextTick()
    value.mockClear()
    column.title = 'New'
    column.width = '150px'
    column.class = 'custom'
    formatted.value = true
    await nextTick()
    expect(wrapper.find('.dt182-column').text()).toBe('New')
    expect(wrapper.find('.dt182-cell').classes()).toContain('custom')
    expect(wrapper.find('strong').text()).toBe('Slot')
    expect(wrapper.find('.dt182-table').attributes('style')).toContain('150px')
    expect(value.mock.calls.some(([row]) => (row as RowItem).id === 2)).toBe(false)
    wrapper.unmount()
  })

  it('changes backend sortField without remounting and ignores appearance for transport', async () => {
    const fetch = mockFetch()
    const column = reactive({
      sortField: 'first',
      title: 'Old',
      textOverflow: 'wrap' as 'wrap' | 'ellipsis',
    })
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users', defaultSort: { by: 'name', direction: 'asc' } },
      slots: {
        default: () => [
          h(DataTableColumn, { key: 'name', field: 'name', sortable: true, ...column }),
        ],
      },
    })
    await flushPromises()
    column.title = 'New'
    column.textOverflow = 'ellipsis'
    await wrapper.setProps({ density: 'compact' })
    await nextTick()
    expect(fetch).toHaveBeenCalledTimes(1)
    column.sortField = 'second'
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(JSON.parse(fetch.mock.calls[1][1].body).sortBy).toBe('second')
    wrapper.unmount()
  })
})
