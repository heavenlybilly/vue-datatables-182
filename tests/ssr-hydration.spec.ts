import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { DataTable, DataTableColumn, Source, VueDatatables182 } from '../src'
import GlobalTable from './helpers/global-table'

const LocalTable = defineComponent({
  setup: () => () =>
    h(
      DataTable,
      {
        rowKey: 'id',
        source: Source.LOCAL,
        items: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ],
        defaultSearchQuery: 'Alice',
        selection: true,
        numbering: true,
      },
      {
        default: () => [h(DataTableColumn, { field: 'name', title: 'Name', searchable: true })],
      },
    ),
})

describe('SSR and hydration', () => {
  it.each([LocalTable, GlobalTable])(
    'renders local data and hydrates without warnings',
    async (component) => {
      const create = () => createSSRApp(component).use(VueDatatables182, { registerGlobally: true })
      const html = await renderToString(create())
      expect(html).toContain(component === LocalTable ? 'Alice' : 'Anna')
      expect(html).not.toContain('Bob')
      expect(html).toContain('role="table"')
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.append(container)
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const app = create()
      try {
        app.mount(container)
        await nextTick()
        expect(container.textContent).toContain(component === LocalTable ? 'Alice' : 'Anna')
        expect(warn).not.toHaveBeenCalled()
        expect(error).not.toHaveBeenCalled()
      } finally {
        app.unmount()
        container.remove()
        warn.mockRestore()
        error.mockRestore()
      }
    },
  )
})
