import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import { Source } from '../src/types'
import { deferred, mockFetch, mockResponse } from './helpers/remote-table'

const columns = () => [h(DataTableColumn, { field: 'name', searchable: true })]

describe('table data states', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('distinguishes empty and no-results while retaining toolbar and header', async () => {
    const wrapper = mount(DataTable, {
      props: { source: Source.LOCAL, rowKey: 'id', items: [] },
      slots: { default: columns },
    })
    await nextTick()
    expect(wrapper.find('.dt182-data-state--empty').text()).toBe('Нет данных.')
    await wrapper.setProps({ items: [{ id: 1, name: 'Alice' }], searchQuery: undefined })
    const search = wrapper.find('input')
    await search.setValue('missing')
    expect(wrapper.find('.dt182-data-state--noResults p').text()).toBe('Ничего не найдено.')
    expect(wrapper.find('.dt182-head').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
    await wrapper.get('.dt182-clear-search').trigger('click')
    expect((search.element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('.dt182-data-state--noResults').exists()).toBe(false)
    expect(wrapper.get('.dt182-row').text()).toBe('Alice')
    wrapper.unmount()
  })

  it('requests clearing controlled search without changing it until the parent updates', async () => {
    const wrapper = mount(DataTable, {
      props: {
        source: Source.LOCAL,
        rowKey: 'id',
        items: [{ id: 1, name: 'Alice' }],
        searchQuery: 'missing',
        messages: { clearSearch: 'Reset query' },
      },
      slots: { default: columns },
    })
    expect(wrapper.get('.dt182-clear-search').text()).toBe('Reset query')
    await wrapper.get('.dt182-clear-search').trigger('click')
    expect(wrapper.emitted('update:searchQuery')).toEqual([['']])
    expect(wrapper.find('.dt182-data-state--noResults').exists()).toBe(true)
    await wrapper.setProps({ searchQuery: '' })
    expect(wrapper.get('.dt182-row').text()).toBe('Alice')
    wrapper.unmount()
  })

  it('does not offer to clear an empty search when remote filtering returns no rows', async () => {
    mockFetch({ items: [], total: 1, filtered: 0 })
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users' },
      slots: { default: columns },
    })
    await flushPromises()
    expect(wrapper.find('.dt182-data-state--noResults').exists()).toBe(true)
    expect(wrapper.find('.dt182-clear-search').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows initial loading, shimmers existing rows, hides failed rows and retries', async () => {
    const first = deferred<Response>()
    const next = deferred<Response>()
    const fetch = mockFetch({ items: [{ id: 2, name: 'Recovered' }], total: 1 })
    fetch.mockReturnValueOnce(first.promise).mockReturnValueOnce(next.promise)
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users' },
      slots: { default: columns },
    })
    await nextTick()
    expect(wrapper.find('.dt182-data-state--loading').text()).toContain('Загрузка')
    first.resolve(mockResponse({ items: [{ id: 1, name: 'Alice' }], total: 1 }))
    await flushPromises()
    const reload = wrapper.vm.reload()
    await nextTick()
    expect(wrapper.find('.dt182-cell--loading').exists()).toBe(true)
    expect(wrapper.find('.dt182-data-state--loading').exists()).toBe(false)
    next.resolve({ ok: false, status: 503 } as Response)
    await reload
    await nextTick()
    expect(wrapper.find('.dt182-data-state--error').text()).toContain('Не удалось')
    expect(wrapper.find('.dt182-row').exists()).toBe(false)
    await wrapper.find('.dt182-data-state button').trigger('click')
    await flushPromises()
    expect(wrapper.find('.dt182-row').text()).toBe('Recovered')
    expect(fetch).toHaveBeenCalledTimes(3)
    wrapper.unmount()
  })

  it('forwards state slots and passes error/retry to the custom error slot', async () => {
    const fetch = mockFetch({ items: [{ id: 1, name: 'Alice' }], total: 1 })
    fetch.mockRejectedValueOnce(new Error('offline'))
    const wrapper = mount(DataTable, {
      props: { rowKey: 'id', url: '/users' },
      slots: {
        default: columns,
        loading: () => [h('div', 'Custom loading')],
        error: ({ error, retry }: { error: unknown; retry: () => Promise<void> }) => [
          h('button', { onClick: retry }, String(error)),
        ],
        empty: () => [h('div', 'Custom empty')],
        noResults: () => [h('div', 'Custom no results')],
      },
    })
    await nextTick()
    await flushPromises()
    expect(wrapper.find('.dt182-data-state--error').text()).toContain('offline')
    await wrapper.find('.dt182-data-state button').trigger('click')
    await flushPromises()
    expect(wrapper.find('.dt182-row').text()).toBe('Alice')
    fetch.mockResolvedValueOnce(mockResponse({ items: [], total: 1, filtered: 0 }))
    await wrapper.vm.reload()
    await nextTick()
    expect(wrapper.find('.dt182-data-state--noResults').text()).toBe('Custom no results')
    fetch.mockResolvedValueOnce(mockResponse({ items: [], total: 0 }))
    await wrapper.vm.reload()
    await nextTick()
    expect(wrapper.find('.dt182-data-state--empty').text()).toBe('Custom empty')
    wrapper.unmount()
  })
})
