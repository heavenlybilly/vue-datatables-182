import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { DataTable, DataTableColumn, Source, VueDatatables182 } from '../src'
import type { TableMessages } from '../src'

const columns = () => [h(DataTableColumn, { field: 'name', title: 'Name' })]
const props = { rowKey: 'id', source: Source.LOCAL, items: [] }

describe('table messages', () => {
  it('copies app settings, isolates apps and lets a table override reactive messages', async () => {
    const messages: Partial<TableMessages> = {
      empty: 'Nothing here',
      search: 'Find',
      pageDetails: ({ start, end }) => `${start}–${end}`,
    }
    const first = mount(DataTable, {
      props,
      slots: { default: columns },
      global: { plugins: [[VueDatatables182, { messages }]] },
    })
    messages.empty = 'Mutated'
    const second = mount(DataTable, { props, slots: { default: columns } })
    expect(first.find('.dt182-data-state').text()).toBe('Nothing here')
    expect(first.find('.dt182-page-details').text()).toBe('0–0')
    expect(second.find('.dt182-data-state').text()).toBe('Нет данных.')
    await first.setProps({ messages: { empty: 'Local', search: 'Local search', retry: undefined } })
    expect(first.find('.dt182-data-state').text()).toBe('Local')
    expect(first.find('input').attributes('aria-label')).toBe('Local search')
    expect(second.find('input').attributes('aria-label')).toBe('Поиск')
    first.unmount()
    second.unmount()
  })

  it('reports zero-to-zero after removing the last page', async () => {
    const wrapper = mount(DataTable, {
      props: {
        ...props,
        items: [{ id: 1 }, { id: 2 }],
        defaultPage: 2,
        defaultRowsPerPageCount: 1,
      },
      slots: { default: columns },
    })
    await wrapper.setProps({ items: [] })
    expect(wrapper.find('.dt182-page-details').text()).toBe('Записи с 0 до 0 из 0 записей')
    wrapper.unmount()
  })
})
