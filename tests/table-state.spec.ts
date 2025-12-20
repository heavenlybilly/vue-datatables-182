import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Fragment, h, nextTick, reactive, ref } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import { Source } from '../src/types'

const columns = () => [h(DataTableColumn, { field: 'name', sortable: true, searchable: true })]
const items = Array.from({ length: 40 }, (_, index) => ({ id: index, name: `User ${index}` }))

describe('table synchronization', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('sorts frozen input without changing its order', async () => {
    const rows = Object.freeze([
      { id: 2, name: 'B' },
      { id: 1, name: 'A' },
    ])
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items: rows,
        defaultSort: { by: 'field:name', direction: 'asc' },
      },
      slots: { default: columns },
    })
    await nextTick()
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.tableData.items.map((row) => row.id)).toEqual([1, 2])
    expect(rows.map((row) => row.id)).toEqual([2, 1])
    wrapper.unmount()
  })

  it('reacts to nested item changes and clamps a shrunken page in one processing pass', async () => {
    const rows = reactive([
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ])
    const value = vi.fn((row: unknown) => (row as { name: string }).name)
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items: rows,
        defaultPage: 2,
        defaultRowsPerPageCount: 1,
        defaultSearchQuery: 'B',
      },
      slots: { default: () => [h(DataTableColumn, { key: 'name', value, searchable: true })] },
    })
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.page).toBe(1)
    expect(controller.state.tableData.items).toMatchObject([{ id: 2 }])
    await nextTick()
    value.mockClear()
    rows[1].name = 'C'
    await nextTick()
    expect(controller.state.tableData.items).toEqual([])
    expect(value.mock.calls.filter(([row]) => (row as { id: number }).id === 1)).toHaveLength(1)
    wrapper.unmount()
  })

  it('updates Fragment columns and clears a removed sort without remounting', async () => {
    const visible = ref(true)
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items,
        defaultSort: { by: 'name', direction: 'asc' },
      },
      slots: {
        default: () =>
          h(
            Fragment,
            {},
            visible.value
              ? [h(DataTableColumn, { key: 'name', field: 'name', sortable: true })]
              : [],
          ),
      },
    })
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.sort.by).toBe('name')
    visible.value = false
    await nextTick()
    expect(controller.columns).toHaveLength(0)
    expect(controller.state.sort.by).toBeNull()
    expect(wrapper.emitted('update:sort')).toEqual([[null]])
    wrapper.unmount()
  })
  it('keeps a user-selected page size through rendering and appearance changes', async () => {
    const wrapper = mount(DataTable, {
      props: { source: Source.LOCAL, rowKey: 'id', items, defaultRowsPerPageCount: 10 },
      slots: { default: columns },
    })
    const controller = wrapper.findComponent(Root).props('controller')
    controller.handlers.rowsPerPageCountChange(25)
    await nextTick()
    await wrapper.setProps({ striped: true })
    expect(controller.state.rowsPerPageCount).toBe(25)
    expect(controller.state.tableData.items).toHaveLength(25)
    wrapper.unmount()
  })

  it('groups parent updates and does not echo valid controlled props', async () => {
    const adapter = vi.fn(({ url, requestBody }) => ({ url, requestBody }))
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [], total: 100 }),
    })
    vi.stubGlobal('fetch', fetch)
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.REMOTE,
        url: '/users',
        page: 2,
        searchQuery: '',
        rowsPerPageCount: 10,
        requestAdapter: adapter,
        responseAdapter: (data) => data as { items: []; total: number },
      },
      slots: { default: columns },
    })
    await flushPromises()
    await wrapper.setProps({ rowsPerPageCount: 25, searchQuery: 'x', striped: true })
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(adapter.mock.calls[1][0].requestBody).toMatchObject({
      page: 1,
      perPage: 25,
      search: 'x',
    })
    expect(wrapper.emitted('update:rowsPerPageCount')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not reprocess rows when selection or appearance changes', async () => {
    const value = vi.fn((item: unknown) => (item as { name: string }).name)
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items,
        selection: true,
        defaultSearchQuery: 'User',
      },
      slots: { default: () => [h(DataTableColumn, { key: 'name', value, searchable: true })] },
    })
    const controller = wrapper.findComponent(Root).props('controller')
    await nextTick()
    const calls = value.mock.calls.length
    controller.handlers.toggleRowSelection(controller.state.tableData.items[0])
    await nextTick()
    await wrapper.setProps({ verticalBorders: true })
    expect(value).toHaveBeenCalledTimes(calls)
    expect(controller.state.selectedRowKeys).toEqual([0])
    wrapper.unmount()
  })
})
