import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import BodyCellSelection from '../src/components/layout/table/body/BodyCellSelection.vue'
import CheckboxElement from '../src/components/layout/table/controls/CheckboxElement.vue'
import HeaderCellSelection from '../src/components/layout/table/header/HeaderCellSelection.vue'
import { CheckboxState } from '../src/components/layout/table/types'
import { Source } from '../src/types'

const items = [{ id: 1 }, { id: 2 }, { id: 3 }]
const columns = () => [h(DataTableColumn, { field: 'id' })]

describe('selection controls', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('keeps an empty header unchecked while initial remote keys await validation', async () => {
    let finish!: (response: Response) => void
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            finish = resolve
          }),
      ),
    )
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.REMOTE,
        url: '/users',
        selection: true,
        defaultSelectedRowKeys: [1],
        requestAdapter: ({ url }) => ({ url }),
        responseAdapter: () => ({ items, total: 3, filtered: 3 }),
      },
      slots: { default: columns },
    })
    await nextTick()
    const header = wrapper.findComponent(HeaderCellSelection).findComponent(CheckboxElement)
    expect(header.props('value')).toBe(CheckboxState.UNCHECKED)
    expect(header.props('disabled')).toBe(true)
    expect(wrapper.findComponent(Root).props('controller').state.selectedRowKeys).toEqual([1])
    wrapper.unmount()
    finish(new Response('{}'))
  })

  it('keeps a limited select-all mixed and ignores repeated clicks on the same subset', async () => {
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', source: Source.LOCAL, items, selection: true, selectionLimit: 1 },
      slots: { default: columns },
    })
    await nextTick()
    const header = wrapper.findComponent(HeaderCellSelection).findComponent(CheckboxElement)
    await header.find('input').trigger('click')
    expect(wrapper.findComponent(Root).props('controller').state.selectedRowKeys).toEqual([1])
    expect(header.props('value')).toBe(CheckboxState.INDETERMINATE)
    await header.find('input').trigger('click')
    expect(wrapper.emitted('selectionChange')).toHaveLength(1)
    wrapper.unmount()
  })

  it('clears a fully selected page on the second select-all click', async () => {
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', source: Source.LOCAL, items, selection: true, selectionLimit: null },
      slots: { default: columns },
    })
    await nextTick()
    const header = wrapper.findComponent(HeaderCellSelection).findComponent(CheckboxElement)
    await header.find('input').trigger('click')
    expect(header.props('value')).toBe(CheckboxState.CHECKED)
    await header.find('input').trigger('click')
    expect(header.props('value')).toBe(CheckboxState.UNCHECKED)
    expect(wrapper.findComponent(Root).props('controller').state.selectedRowKeys).toEqual([])
    wrapper.unmount()
  })

  it('disables all selection controls at limit zero and the empty select-all control', async () => {
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', source: Source.LOCAL, items, selection: true, selectionLimit: 0 },
      slots: { default: columns },
    })
    await nextTick()
    const checkboxes = wrapper.findAllComponents(CheckboxElement)
    expect(checkboxes).toHaveLength(4)
    await Promise.all(
      checkboxes.map(async (checkbox) => {
        expect(checkbox.props('disabled')).toBe(true)
        await checkbox.find('input').trigger('click')
      }),
    )
    expect(wrapper.emitted('selectionChange')).toBeUndefined()
    await wrapper.setProps({ items: [], selectionLimit: null })
    const header = wrapper.findComponent(HeaderCellSelection).findComponent(CheckboxElement)
    expect(header.props('disabled')).toBe(true)
    expect(header.props('value')).toBe(CheckboxState.UNCHECKED)
    wrapper.unmount()
  })

  it('does not emit rowClick or toggle twice when a row checkbox is clicked', async () => {
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items,
        selection: true,
        rowsClickable: true,
        selectOnRowClick: true,
      },
      slots: { default: columns },
    })
    await nextTick()
    await wrapper
      .findComponent(BodyCellSelection)
      .findComponent(CheckboxElement)
      .find('input')
      .trigger('click')
    expect(wrapper.findComponent(Root).props('controller').state.selectedRowKeys).toEqual([1])
    expect(wrapper.emitted('selectionChange')).toHaveLength(1)
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    wrapper.unmount()
  })

  it('lets an interactive cell stop row clicks explicitly', async () => {
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        source: Source.LOCAL,
        items,
        selection: true,
        rowsClickable: true,
        selectOnRowClick: true,
      },
      slots: {
        default: () => [
          h(
            DataTableColumn,
            { key: 'action' },
            {
              cell: () => [
                h(
                  'button',
                  { type: 'button', onClick: (event: Event) => event.stopPropagation() },
                  'Action',
                ),
              ],
            },
          ),
        ],
      },
    })
    await nextTick()
    await wrapper.find('.dt182-cell-content button:not(.dt182-row-action)').trigger('click')
    expect(wrapper.emitted('rowClick')).toBeUndefined()
    expect(wrapper.emitted('selectionChange')).toBeUndefined()
    wrapper.unmount()
  })
})
