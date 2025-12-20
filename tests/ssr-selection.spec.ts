import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { DataTable, DataTableColumn, Source } from '../src'

function consumer(source: Source) {
  return defineComponent({
    setup: () => () =>
      h(
        DataTable,
        {
          rowKey: 'id',
          source,
          url: '/rows',
          items: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
          ],
          selection: true,
          defaultSelectedRowKeys: [1],
        },
        { default: () => [h(DataTableColumn, { field: 'name', title: 'Name' })] },
      ),
  })
}

describe('SSR selection and remote boundaries', () => {
  it('hydrates native indeterminate state', async () => {
    const component = consumer(Source.LOCAL)
    const container = document.createElement('div')
    container.innerHTML = await renderToString(createSSRApp(component))
    expect(container.innerHTML).toContain('aria-checked="mixed"')
    const app = createSSRApp(component)
    app.mount(container)
    await nextTick()
    expect(
      container.querySelector<HTMLInputElement>('input[aria-checked="mixed"]')?.indeterminate,
    ).toBe(true)
    app.unmount()
  })

  it('starts a remote request only after client mount and hydrates the empty state', async () => {
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ id: 1, name: 'Remote' }], total: 1 }),
    })
    vi.stubGlobal('fetch', fetch)
    const component = consumer(Source.REMOTE)
    const container = document.createElement('div')
    const app = createSSRApp(component)
    try {
      container.innerHTML = await renderToString(createSSRApp(component))
      expect(fetch).not.toHaveBeenCalled()
      app.mount(container)
      await flushPromises()
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(container.textContent).toContain('Remote')
    } finally {
      app.unmount()
      vi.unstubAllGlobals()
    }
  })
})
