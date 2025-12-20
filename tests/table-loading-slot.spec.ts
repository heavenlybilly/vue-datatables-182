import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DataTable from '../src/components/DataTable.vue'
import DataTableColumn from '../src/components/DataTableColumn.vue'
import Root from '../src/components/layout/Root.vue'
import { deferred, mockFetch, mockResponse } from './helpers/remote-table'

describe('custom loading slot', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('can replace shimmer dynamically while a request with existing rows is pending', async () => {
    const pending = deferred<Response>()
    const fetch = mockFetch({ items: [{ id: 1 }], total: 1 })
    fetch
      .mockResolvedValueOnce(mockResponse({ items: [{ id: 1 }], total: 1 }))
      .mockReturnValueOnce(pending.promise)
    const custom = ref(false)
    const Consumer = defineComponent({
      setup: () => () =>
        h(
          DataTable,
          { rowKey: 'id', url: '/users' },
          {
            default: () => [h(DataTableColumn, { field: 'id' })],
            ...(custom.value ? { loading: () => [h('div', 'Custom loading')] } : {}),
          },
        ),
    })
    const wrapper = mount(Consumer)
    await flushPromises()
    const controller = wrapper.findComponent(Root).props('controller')
    const work = controller.handlers.reload()
    await nextTick()
    expect(wrapper.find('.dt182-cell--loading').exists()).toBe(true)
    custom.value = true
    await nextTick()
    expect(wrapper.find('.dt182-data-state--loading').text()).toBe('Custom loading')
    expect(wrapper.find('.dt182-row').exists()).toBe(false)
    custom.value = false
    await nextTick()
    expect(wrapper.find('.dt182-cell--loading').exists()).toBe(true)
    pending.resolve(mockResponse({ items: [{ id: 2 }], total: 1 }))
    await work
    await nextTick()
    expect(wrapper.find('.dt182-row').text()).toBe('2')
    wrapper.unmount()
  })
})
