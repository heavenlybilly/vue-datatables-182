import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import { mockFetch, mockResponse } from './helpers/remote-table'

const columns = () => [h(DataTableColumn, { field: 'id' })]

describe('remote synchronization', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('corrects a controlled page without a duplicate request or premature data update', async () => {
    const fetch = mockFetch()
    fetch
      .mockResolvedValueOnce(mockResponse({ items: [], total: 30 }))
      .mockResolvedValueOnce(mockResponse({ items: [{ id: 30 }], total: 30 }))
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users', page: 4 },
      slots: { default: columns },
    })
    await flushPromises()
    const controller = wrapper.findComponent(Root).props('controller')
    expect(controller.state.page).toBe(2)
    expect(controller.state.tableData.items).toEqual([{ id: 30 }])
    expect(wrapper.emitted('update:page')).toEqual([[2]])
    expect(fetch).toHaveBeenCalledTimes(2)
    await wrapper.setProps({ page: 2 })
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('cancels pending debounce on reload and uses the newest query immediately', async () => {
    vi.useFakeTimers()
    const fetch = mockFetch()
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users' },
      slots: { default: columns },
    })
    await flushPromises()
    const controller = wrapper.findComponent(Root).props('controller')
    controller.handlers.searchInput('  newest  ')
    await nextTick()
    expect(fetch).toHaveBeenCalledTimes(1)
    await wrapper.vm.reload()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(JSON.parse(fetch.mock.calls[1][1].body).search).toBe('newest')
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('accepts a full result without pagination limits and excludes disabled search', async () => {
    const items = Array.from({ length: 40 }, (_, id) => ({ id }))
    const fetch = mockFetch({ items, total: 40 })
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        url: '/users',
        pagination: false,
        search: false,
        defaultSearchQuery: 'hidden',
      },
      slots: { default: columns },
    })
    await flushPromises()
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ filter: {} })
    expect(wrapper.findComponent(Root).props('controller').state.tableData.items).toHaveLength(40)
    wrapper.unmount()
  })
})
