import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { DataTable, DataTableColumn, Source } from '../src'

const items = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]
const columns = () => [
  h(DataTableColumn, { field: 'name', title: 'Name', sortable: true, searchable: true }),
]

function table() {
  return mount(DataTable, {
    attachTo: document.body,
    props: {
      rowKey: 'id',
      source: Source.LOCAL,
      items,
      selection: true,
      rowsClickable: true,
      defaultRowsPerPageCount: 1,
      rowsPerPageOptions: [1, 2],
    },
    slots: { default: columns },
  })
}

describe('table accessibility', () => {
  it('exposes table structure and native controls with labels', async () => {
    const wrapper = table()
    await nextTick()
    expect(wrapper.find('[role="table"]').attributes('aria-label')).toBe('Таблица данных')
    expect(wrapper.findAll('[role="columnheader"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="row"]')).toHaveLength(2)
    expect(wrapper.findAll('[role="cell"]')).toHaveLength(2)
    expect(wrapper.find('input[type="text"]').attributes('aria-label')).toBe('Поиск')
    expect(wrapper.find('select').element.closest('label')?.textContent).toContain(
      'Записей на странице',
    )
    expect(wrapper.find('[aria-label="Первая страница"]').element).toHaveProperty('disabled', true)
    expect(wrapper.find('[aria-current="page"]').text()).toBe('1')
    await wrapper.find('[aria-label="Следующая страница"]').trigger('click')
    expect(wrapper.find('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.find('[aria-label="Следующая страница"]').element).toHaveProperty(
      'disabled',
      true,
    )
    wrapper.unmount()
  })

  it('updates aria-sort through a native button and keeps focus after clearing search', async () => {
    const wrapper = table()
    const sort = wrapper.find('[aria-label="Сортировать: Name"]')
    expect(sort.element.tagName).toBe('BUTTON')
    await sort.trigger('click')
    expect(sort.element.closest('[role="columnheader"]')?.getAttribute('aria-sort')).toBe(
      'ascending',
    )
    await sort.trigger('click')
    expect(sort.element.closest('[role="columnheader"]')?.getAttribute('aria-sort')).toBe(
      'descending',
    )
    const search = wrapper.find('input[type="text"]')
    await search.setValue('missing')
    expect(wrapper.find('.dt182-data-state p').text()).toBe('Ничего не найдено.')
    await wrapper.find('[aria-label="Очистить поиск"]').trigger('click')
    expect(document.activeElement).toBe(search.element)
    expect(wrapper.find('.dt182-row').text()).toContain('Bob')
    wrapper.unmount()
  })

  it('preserves a mixed controlled checkbox when a selection limit rejects another click', async () => {
    const wrapper = table()
    await wrapper.setProps({ selectionLimit: 1 })
    await wrapper.find('select').setValue('2')
    const selectAll = wrapper.find<HTMLInputElement>('[aria-label="Выбрать все видимые строки"]')
    await selectAll.trigger('click')
    expect(selectAll.element.indeterminate).toBe(true)
    expect(selectAll.attributes('aria-checked')).toBe('mixed')
    await selectAll.trigger('click')
    expect(selectAll.element.indeterminate).toBe(true)
    expect(selectAll.element.checked).toBe(false)
    const rowAction = wrapper.find('.dt182-row-action')
    await rowAction.trigger('click')
    expect(wrapper.emitted('rowClick')).toHaveLength(1)
    wrapper.unmount()
  })
})
