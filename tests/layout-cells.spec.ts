import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import TableRow from '../src/components/layout/table/body/TableRow.vue'
import type { CellSlotProps } from '../src/types'
import { Source } from '../src/types'

const items = [
  { id: 1, name: 'First' },
  { id: '2', name: 'Second' },
]

describe('cell layout and scope', () => {
  it('uses the same sticky order, offsets, classes and alignment for header and body', async () => {
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items,
        numbering: true,
        selection: true,
        scrollX: true,
        stickyHeader: true,
        striped: true,
        verticalBorders: true,
      },
      slots: {
        default: () => [
          h(DataTableColumn, {
            field: 'name',
            title: 'Name',
            class: ['named', { bold: true }],
            textAlign: 'right',
          }),
          h(DataTableColumn, { field: 'id', title: 'Id', sticky: 'left', width: '100.5px' }),
          h(DataTableColumn, {
            key: 'amount',
            field: 'id',
            title: 'Amount',
            sticky: 'right',
            width: '60px',
          }),
        ],
      },
    })
    await nextTick()
    const headers = wrapper.findAll('.dt182-head > .dt182-column')
    const cells = wrapper.findAllComponents(TableRow)[0].findAll('.dt182-cell')
    expect(headers.map((header) => header.text())).toEqual(['#', '', 'Id', 'Name', 'Amount'])
    expect(cells.map((cell) => cell.text())).toEqual(['1', '', '1', 'First', '1'])
    expect(headers[2].attributes('style')).toContain('left: 92px')
    expect(cells[2].attributes('style')).toContain('left: 92px')
    expect(headers[4].attributes('style')).toContain('right: 0px')
    expect(cells[4].attributes('style')).toContain('right: 0px')
    expect(headers[0].attributes('style')).toContain('top: 0px')
    expect(headers[3].classes()).toEqual(expect.arrayContaining(['named', 'bold']))
    expect(cells[3].classes()).toEqual(expect.arrayContaining(['named', 'bold']))
    expect(cells[3].attributes('style')).toContain('text-align: right')
    expect(wrapper.find('.dt182-table-viewport--scroll').exists()).toBe(true)
    expect(wrapper.find('.dt182-head').classes()).toContain('dt182-with-vertical-borders')
    expect(wrapper.findAllComponents(TableRow)[1].classes()).toContain('dt182-row--striped')
    await wrapper.setProps({
      stickyHeader: false,
      scrollX: false,
      striped: false,
      verticalBorders: false,
    })
    expect(wrapper.find('.dt182-column').attributes('style')).not.toContain('top:')
    expect(wrapper.find('.dt182-table-viewport--scroll').exists()).toBe(false)
    expect(wrapper.find('.dt182-row--striped').exists()).toBe(false)
    wrapper.unmount()
  })

  it('supplies the full typed scope to slot-only, field and value columns across pages', async () => {
    const columns = [
      { key: 'slot' },
      { key: 'field', field: 'name' },
      { key: 'value', value: () => 'computed' },
    ]
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items,
        defaultRowsPerPageCount: 1,
        defaultPage: 2,
      },
      slots: {
        default: () =>
          columns.map((column) =>
            h(DataTableColumn, column, {
              cell: ({ item, key, index, number }: CellSlotProps) => [
                h('span', `${item.name}:${typeof key}:${key}:${index}:${number}`),
              ],
            }),
          ),
      },
    })
    await nextTick()
    expect(wrapper.findAll('.dt182-cell-slot').map((cell) => cell.text())).toEqual(
      Array(3).fill('Second:string:2:0:2'),
    )
    await wrapper.setProps({ pagination: false })
    expect(wrapper.findAll('.dt182-cell-slot')[0].text()).toBe('First:number:1:0:1')
    wrapper.unmount()
  })
})
