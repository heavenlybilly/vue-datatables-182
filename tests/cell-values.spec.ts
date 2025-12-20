import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import BodyCellData from '../src/components/layout/table/body/BodyCellData.vue'
import type { RowItem } from '../src/types'
import { Source } from '../src/types'

const props = { rowKey: 'id', source: Source.LOCAL, items: [{ id: 1, field: 'ignored' }] }

describe('cell values', () => {
  it('uses value over field and tracks external display dependencies without remount', async () => {
    const label = ref('computed')
    const wrapper = mount(DataTable, {
      props,
      slots: {
        default: () => [
          h(DataTableColumn, { key: 'value', field: 'field', value: () => label.value }),
        ],
      },
    })
    await nextTick()
    expect(wrapper.findComponent(BodyCellData).text()).toBe('computed')
    label.value = 'updated'
    await nextTick()
    expect(wrapper.findComponent(BodyCellData).text()).toBe('updated')
    wrapper.unmount()
  })

  it.each([null, undefined, false, 0, '<b>&amp;</b>'])(
    'renders %s as literal text',
    async (value) => {
      const wrapper = mount(DataTable, {
        props: { ...props, items: [{ id: 1, field: value }] },
        slots: { default: () => [h(DataTableColumn, { field: 'field' })] },
      })
      await nextTick()
      expect(wrapper.findComponent(BodyCellData).text()).toBe(value == null ? '' : String(value))
      expect(wrapper.find('b').exists()).toBe(false)
      wrapper.unmount()
    },
  )

  it('lets cell-slot replace display while search still uses the value resolver', async () => {
    const wrapper = mount(DataTable, {
      props: {
        ...props,
        items: [{ id: 1, field: 'ignored', name: 'value' }],
        defaultSearchQuery: 'value',
      },
      slots: {
        default: () => [
          h(
            DataTableColumn,
            {
              key: 'value',
              field: 'field',
              value: (row: unknown) => (row as RowItem).name,
              searchable: true,
            },
            { cell: () => [h('span', 'Formatted')] },
          ),
        ],
      },
    })
    await nextTick()
    expect(wrapper.text()).toContain('Formatted')
    const controller = wrapper.findComponent(Root).props('controller')
    controller.handlers.searchInput('Formatted')
    await nextTick()
    expect(controller.state.tableData.filtered).toBe(0)
    wrapper.unmount()
  })
})
