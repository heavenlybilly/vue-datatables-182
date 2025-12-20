import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, reactive } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import type { BuiltResponse, RequestAdapter, ResponseAdapter } from '../src/types'
import { Source } from '../src/types'

const requestAdapter: RequestAdapter = ({ url, requestBody }) => ({ url, requestBody })
const responseAdapter: ResponseAdapter = (data) => data as BuiltResponse
const setup = (controlled = false) => {
  const fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ items: [{ id: 1 }], total: 100, filtered: 100 }),
  })
  vi.stubGlobal('fetch', fetch)
  const wrapper = mount(DataTable, {
    props: {
      rowKey: 'id',
      url: '/users',
      requestAdapter,
      responseAdapter,
      selection: true,
      ...(controlled ? { searchQuery: '', page: 2, selectedRowKeys: [1] } : { defaultPage: 2 }),
    },
    slots: { default: () => [h(DataTableColumn, { field: 'id' })] },
  })
  const controller = wrapper.findComponent(Root).props('controller')
  return { wrapper, controller, fetch }
}

describe('request scheduling', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('debounces deep filter updates and normalizes dependent controlled page and selection', async () => {
    vi.useFakeTimers()
    const { wrapper, controller, fetch } = setup(true)
    await flushPromises()
    controller.handlers.selectAllRows()
    const filter = reactive({ active: true })
    await wrapper.setProps({ filter })
    expect(controller.state.page).toBe(1)
    expect(controller.state.selectedRowKeys).toEqual([])
    expect(fetch).toHaveBeenCalledTimes(1)
    filter.active = false
    await nextTick()
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({
      page: 1,
      filter: { active: false },
    })
    wrapper.unmount()
  })

  it('groups simultaneous URL and adapter changes into one immediate request', async () => {
    const { wrapper, fetch } = setup()
    await flushPromises()
    const adapter = vi.fn(requestAdapter)
    await wrapper.setProps({ url: '/other', requestAdapter: adapter })
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(adapter).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[1][0]).toBe('/other')
    wrapper.unmount()
  })

  it('makes the initial request immediately and debounces a search that resets page', async () => {
    vi.useFakeTimers()
    const { wrapper, controller, fetch } = setup()
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(controller.state.page).toBe(2)
    controller.handlers.searchInput('a')
    controller.handlers.searchInput('anna')
    await nextTick()
    vi.advanceTimersByTime(299)
    expect(fetch).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1)
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(JSON.parse(fetch.mock.calls[1][1].body)).toMatchObject({ page: 1, search: 'anna' })
    wrapper.unmount()
  })

  it('waits for controlled search confirmation and ignores selection and appearance updates', async () => {
    vi.useFakeTimers()
    const { wrapper, controller, fetch } = setup(true)
    await flushPromises()
    controller.handlers.searchInput('anna')
    controller.handlers.toggleRowSelection(controller.state.tableData.items[0])
    await wrapper.setProps({ striped: true })
    vi.advanceTimersByTime(300)
    expect(fetch).toHaveBeenCalledTimes(1)
    await wrapper.setProps({ searchQuery: 'anna' })
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(fetch).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('cancels pending search when an immediate page-size change or source change occurs', async () => {
    vi.useFakeTimers()
    const { wrapper, controller, fetch } = setup()
    await flushPromises()
    controller.handlers.searchInput('anna')
    await nextTick()
    controller.handlers.rowsPerPageCountChange(50)
    await nextTick()
    expect(fetch).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(300)
    expect(fetch).toHaveBeenCalledTimes(2)
    await flushPromises()
    controller.handlers.searchInput('next')
    await nextTick()
    await wrapper.setProps({ source: Source.LOCAL, items: [{ id: 9 }] })
    vi.advanceTimersByTime(300)
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(controller.state.tableData.items).toEqual([{ id: 9 }])
    wrapper.unmount()
  })
})
