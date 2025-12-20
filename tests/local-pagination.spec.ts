import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import Paginator from '../src/components/layout/controls/Paginator.vue'
import RowsPerPageSelector from '../src/components/layout/controls/RowsPerPageSelector.vue'
import BodyCellNumbering from '../src/components/layout/table/body/BodyCellNumbering.vue'
import PageDetails from '../src/components/layout/widgets/PageDetails.vue'
import { Source } from '../src/types'

const rows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: index + 1, name: `Row ${index + 1}` }))
const columns = () => [h(DataTableColumn, { field: 'name', searchable: true })]
const mountTable = (count: number, page: number) =>
  mount(DataTable, {
    props: {
      rowKey: 'id',
      source: Source.LOCAL,
      items: rows(count),
      page,
      defaultRowsPerPageCount: 1,
    },
    slots: { default: columns },
  })

describe('local pagination', () => {
  it('accepts page and growing items in one parent update without clamping against old counts', async () => {
    const wrapper = mountTable(1, 1)
    await nextTick()
    await wrapper.setProps({ page: 5, items: rows(10) })
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.page).toBe(5)
    expect(controller.state.tableData.items).toEqual([{ id: 5, name: 'Row 5' }])
    expect(wrapper.emitted('update:page')).toBeUndefined()
    wrapper.unmount()
  })

  it('clamps a shrinking dataset before slicing and proposes a correction once', async () => {
    const wrapper = mountTable(10, 8)
    await nextTick()
    await wrapper.setProps({ page: 9, items: rows(3) })
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.page).toBe(3)
    expect(controller.state.tableData.items).toEqual([{ id: 3, name: 'Row 3' }])
    expect(wrapper.emitted('update:page')).toEqual([[3]])
    await wrapper.setProps({ striped: true })
    expect(wrapper.emitted('update:page')).toEqual([[3]])
    wrapper.unmount()
  })

  it('reconciles simultaneous items and selected keys against the new visible data', async () => {
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items: [{ id: 1, name: 'old' }],
        selection: true,
        selectedRowKeys: [],
      },
      slots: { default: columns },
    })
    await nextTick()
    await wrapper.setProps({ items: [{ id: 2, name: 'new' }], selectedRowKeys: [2] })
    expect(wrapper.findComponent(Root).props('controller').state.selectedRowKeys).toEqual([2])
    expect(wrapper.emitted('update:selectedRowKeys')).toBeUndefined()
    expect(wrapper.emitted('selectionChange')).toEqual([
      [{ keys: [2], items: [{ id: 2, name: 'new' }] }],
    ])
    wrapper.unmount()
  })

  it('orders page correction before selection events when page and data change together', async () => {
    const events: string[] = []
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items: rows(10),
        page: 2,
        defaultRowsPerPageCount: 1,
        selection: true,
        selectedRowKeys: [2],
        'onUpdate:page': () => events.push('page'),
        'onUpdate:selectedRowKeys': () => events.push('keys'),
        onSelectionChange: () => events.push('selection'),
      },
      slots: { default: columns },
    })
    await nextTick()
    events.length = 0
    await wrapper.setProps({ page: 9, items: rows(1) })
    expect(events).toEqual(['page', 'keys', 'selection'])
    wrapper.unmount()
  })

  it('hides pagination controls, numbers all rows and shows the full range without pagination', async () => {
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items: rows(3),
        pagination: false,
        defaultRowsPerPageCount: 1,
        defaultPage: 8,
        numbering: true,
      },
      slots: { default: columns },
    })
    await nextTick()
    expect(wrapper.findComponent(Paginator).exists()).toBe(false)
    expect(wrapper.findComponent(RowsPerPageSelector).exists()).toBe(false)
    expect(wrapper.findAllComponents(BodyCellNumbering).map((cell) => cell.text())).toEqual([
      '1',
      '2',
      '3',
    ])
    expect(wrapper.findComponent(PageDetails).text()).toContain('с 1 до 3 из 3')
    expect(wrapper.findComponent(Root).props('controller').state.page).toBe(1)
    wrapper.unmount()
  })

  it('shows 0–0 for an empty range even with a stale remote page', () => {
    const wrapper = mount(PageDetails, {
      props: { total: 0, filtered: 0, countItems: 0, rowsPerPage: 25, page: 3 },
    })
    expect(wrapper.text()).toContain('с 0 до 0 из 0')
    wrapper.unmount()
  })
})
