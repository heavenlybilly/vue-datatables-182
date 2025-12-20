import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import { useRemoteAdapter } from '../src/components/data/useRemoteAdapter'
import Root from '../src/components/layout/Root.vue'
import type { BuiltResponse, RequestAdapter, ResponseAdapter } from '../src/types'
import { Source } from '../src/types'
import { createCore } from './helpers/create-core'

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((done) => {
    resolve = done
  })
  return { promise, resolve }
}
const response = (id: number) =>
  ({
    ok: true,
    json: async () => ({ items: [{ id }], total: 1, filtered: 1 }),
  }) as Response
const requestAdapter: RequestAdapter = ({ url, requestBody }) => ({ url, requestBody })
const responseAdapter: ResponseAdapter = (data) => data as BuiltResponse
const columns = () => [h(DataTableColumn, { field: 'id' })]

describe('data lifecycle', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('keeps the new request loading and ignores a late response after cancellation', async () => {
    const first = deferred<Response>()
    const second = deferred<Response>()
    const fetch = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    vi.stubGlobal('fetch', fetch)
    const { core, columnRegistry, emit } = createCore()
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getCsrfToken: () => undefined,
      getRequestAdapter: () => requestAdapter,
      getResponseAdapter: () => responseAdapter,
    })
    const oldWork = adapter.apply()
    await adapter.apply()
    expect(fetch).toHaveBeenCalledTimes(1)
    const newWork = adapter.reload()
    await oldWork
    expect(core.state.isLoading).toBe(true)
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true)
    first.resolve(response(1))
    await flushPromises()
    expect(core.state.tableData.items).toEqual([])
    second.resolve(response(2))
    await newWork
    expect(core.state.tableData.items).toEqual([{ id: 2 }])
    expect(core.state.isLoading).toBe(false)
    adapter.dispose()
  })

  it('settles pending work on disposal without subsequent events or writes', async () => {
    const pending = deferred<Response>()
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(pending.promise))
    const { core, columnRegistry, emit } = createCore()
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getCsrfToken: () => undefined,
      getRequestAdapter: () => requestAdapter,
      getResponseAdapter: () => responseAdapter,
    })
    const work = adapter.reload()
    adapter.dispose()
    emit.mockClear()
    await work
    pending.resolve(response(1))
    await flushPromises()
    await adapter.reload()
    expect(emit).not.toHaveBeenCalled()
    expect(core.state.tableData.items).toEqual([])
  })

  it('reports request adapter failures without rejecting the operation', async () => {
    const { core, columnRegistry, emit } = createCore()
    const error = new Error('bad adapter')
    const adapter = useRemoteAdapter({
      core,
      columnRegistry,
      emit,
      getUrl: () => '/users',
      getFilter: () => ({}),
      getCsrfToken: () => undefined,
      getRequestAdapter: () => () => {
        throw error
      },
      getResponseAdapter: () => responseAdapter,
    })
    await expect(adapter.apply()).resolves.toBeUndefined()
    expect(emit).toHaveBeenCalledWith('requestError', { requestId: 1, error })
    expect(core.state.isLoading).toBe(false)
    adapter.dispose()
  })

  it('cancels an active remote request on source change and preserves local rows', async () => {
    const pending = deferred<Response>()
    const fetch = vi.fn().mockReturnValue(pending.promise)
    vi.stubGlobal('fetch', fetch)
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users', requestAdapter, responseAdapter },
      slots: { default: columns },
    })
    const controller = wrapper.findComponent(Root).props('controller')
    await wrapper.setProps({ source: Source.LOCAL, items: [{ id: 9 }] })
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true)
    pending.resolve(response(1))
    await flushPromises()
    expect(controller.state.tableData.items).toEqual([{ id: 9 }])
    expect(wrapper.emitted('requestSuccess')).toBeUndefined()
    wrapper.unmount()
  })

  it('leaves exposed clearSelection inert after unmount with selected rows', async () => {
    vi.useFakeTimers()
    const selectionChanged = vi.fn()
    const fetch = vi.fn().mockResolvedValue(response(1))
    vi.stubGlobal('fetch', fetch)
    const wrapper = mount(DataTable, {
      props: {
        rowKey: 'id',
        url: '/users',
        requestAdapter,
        responseAdapter,
        selection: true,
        onSelectionChange: selectionChanged,
      },
      slots: { default: columns },
    })
    await flushPromises()
    const controller = wrapper.findComponent(Root).props('controller')
    controller.handlers.toggleRowSelection(controller.state.tableData.items[0])
    expect(selectionChanged).toHaveBeenCalledTimes(1)
    const clearAfterUnmount = wrapper.vm.clearSelection
    wrapper.unmount()
    clearAfterUnmount()
    expect(selectionChanged).toHaveBeenCalledTimes(1)
  })

  it('cancels debounced search on unmount and leaves reload inert', async () => {
    vi.useFakeTimers()
    const fetch = vi.fn().mockResolvedValue(response(1))
    vi.stubGlobal('fetch', fetch)
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users', requestAdapter, responseAdapter },
      slots: { default: columns },
    })
    await flushPromises()
    const controller = wrapper.findComponent(Root).props('controller')
    controller.handlers.searchInput('a')
    controller.handlers.searchInput('anna')
    await nextTick()
    expect(fetch).toHaveBeenCalledTimes(1)
    const { reload, clearSelection } = wrapper.vm
    wrapper.unmount()
    vi.runAllTimers()
    await reload()
    clearSelection()
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
