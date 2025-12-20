import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import { DataTable, DataTableColumn } from '../src'
import BodyCellWrapper from '../src/components/layout/table/body/BodyCellWrapper.vue'
import type { PaginationSlotProps, SearchSlotProps, ToolbarSlotProps } from '../src/types'

const items = [
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' },
]

const columns = () => [
  h(DataTableColumn, { field: 'name', title: 'Name', sortable: true, searchable: true }),
]

describe('table customization', () => {
  it('sorts only through the separate control, including with a custom header', async () => {
    const title = ref('Custom name')
    const wrapper = mount(DataTable, {
      props: { source: 'local', rowKey: 'id', items },
      slots: {
        default: () => [
          h(
            DataTableColumn,
            { field: 'name', title: 'Name', sortable: true },
            {
              header: () => [h('strong', title.value)],
            },
          ),
        ],
      },
    })
    await wrapper.get('strong').trigger('click')
    expect(wrapper.emitted('update:sort')).toBeUndefined()
    await wrapper.get('.dt182-column').trigger('click')
    expect(wrapper.emitted('update:sort')).toBeUndefined()
    await wrapper.get('button[aria-label="Сортировать: Name"]').trigger('click')
    expect(wrapper.get('[role="columnheader"]').attributes('aria-sort')).toBe('ascending')
    title.value = 'Updated name'
    await nextTick()
    expect(wrapper.get('strong').text()).toBe('Updated name')
    wrapper.unmount()
  })

  it('omits an unused toolbar and restores it when search is enabled', async () => {
    const wrapper = mount(DataTable, {
      props: { source: 'local', rowKey: 'id', items, search: false },
      slots: { default: columns },
    })
    expect(wrapper.find('.dt182-top').exists()).toBe(false)
    await wrapper.setProps({ search: true })
    expect(wrapper.find('.dt182-search-input').exists()).toBe(true)
    wrapper.unmount()
  })

  it('lets external search and pagination controls update normalized state', async () => {
    const wrapper = mount(DataTable, {
      props: { source: 'local', rowKey: 'id', items, defaultRowsPerPageCount: 1 },
      slots: {
        default: columns,
        search: ({ value, setValue }: SearchSlotProps) => [
          h('input', {
            class: 'custom-search',
            value,
            onInput: (event: Event) => setValue((event.target as HTMLInputElement).value),
          }),
        ],
        pagination: ({ page, pageCount, setPage }: PaginationSlotProps) => [
          h(
            'button',
            {
              class: 'custom-page',
              type: 'button',
              onClick: () => setPage(page + 1),
            },
            `${page}/${pageCount}`,
          ),
        ],
      },
    })
    expect(wrapper.find('.dt182-search-input').exists()).toBe(false)
    expect(wrapper.find('.dt182-paginator').exists()).toBe(false)
    await wrapper.get('.custom-page').trigger('click')
    expect(wrapper.get('.dt182-cell').text()).toBe('Beta')
    await wrapper.get('.custom-search').setValue('Alpha')
    expect(wrapper.get('.custom-page').text()).toBe('1/1')
    expect(wrapper.get('.dt182-cell').text()).toBe('Alpha')
    wrapper.unmount()
  })

  it('exposes selection context and clear action to toolbar slots', async () => {
    const wrapper = mount(DataTable, {
      props: { source: 'local', rowKey: 'id', items, selection: true },
      slots: {
        default: columns,
        topRight: ({ selectedCount, clearSelection }: ToolbarSlotProps) => [
          h(
            'button',
            {
              class: 'clear-selection',
              type: 'button',
              onClick: clearSelection,
            },
            String(selectedCount),
          ),
        ],
      },
    })
    await wrapper.get('[aria-label="Выбрать строку 1"]').trigger('click')
    expect(wrapper.get('.clear-selection').text()).toBe('1')
    expect(wrapper.get('.dt182-row').classes()).toContain('dt182-row--selected')
    await wrapper.get('.clear-selection').trigger('click')
    expect(wrapper.get('.clear-selection').text()).toBe('0')
    expect(wrapper.find('.dt182-row--selected').exists()).toBe(false)
    wrapper.unmount()
  })

  it('updates text overflow and density without remounting rows', async () => {
    const ellipsis = ref(false)
    const wrapper = mount(DataTable, {
      props: { source: 'local', rowKey: 'id', items },
      slots: {
        default: () => [
          h(DataTableColumn, {
            field: 'name',
            title: 'Long name',
            textOverflow: ellipsis.value ? 'ellipsis' : 'wrap',
            headerTextOverflow: ellipsis.value ? 'wrap' : 'ellipsis',
          }),
        ],
      },
    })
    const row = wrapper.get('.dt182-row').element
    ellipsis.value = true
    await wrapper.setProps({ density: 'compact' })
    expect(wrapper.attributes('data-density')).toBe('compact')
    expect(wrapper.get('.dt182-row').element).toBe(row)
    expect(wrapper.get('.dt182-cell').classes()).toContain('dt182-cell-ellipsis')
    expect(wrapper.get('.dt182-cell-content > div').attributes('title')).toBe('Alpha')
    expect(wrapper.get('.dt182-column-title').classes()).toContain('dt182-column-title--wrap')
    wrapper.unmount()
  })

  it('mounts shimmer only while loading', async () => {
    const wrapper = mount(BodyCellWrapper, { props: { loading: false } })
    expect(wrapper.find('.dt182-cell-loader').exists()).toBe(false)
    await wrapper.setProps({ loading: true })
    expect(wrapper.get('.dt182-cell-loader').attributes('aria-hidden')).toBe('true')
    await wrapper.setProps({ loading: false })
    expect(wrapper.find('.dt182-cell-loader').exists()).toBe(false)
    wrapper.unmount()
  })
})
