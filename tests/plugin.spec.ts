import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DataTable from '../src/components/DataTable.vue'
import Root from '../src/components/layout/Root.vue'
import plugin from '../src/components/plugin'
import { usePluginConfiguration } from '../src/components/plugin/configuration'
import GlobalTable from './helpers/global-table'

const Consumer = defineComponent({
  setup() {
    const configuration = usePluginConfiguration()
    return () => h('span', configuration.csrfToken ?? 'empty')
  },
})

describe('application configuration', () => {
  it('isolates options between apps and does not leak into an app without the plugin', () => {
    const first = mount(Consumer, { global: { plugins: [[plugin, { csrfToken: 'first' }]] } })
    const second = mount(Consumer, { global: { plugins: [[plugin, { csrfToken: 'second' }]] } })
    const empty = mount(Consumer, { global: { plugins: [plugin] } })
    const plain = mount(Consumer)
    expect([first.text(), second.text(), empty.text(), plain.text()]).toEqual([
      'first',
      'second',
      'empty',
      'empty',
    ])
    ;[first, second, empty, plain].forEach((wrapper) => wrapper.unmount())
  })

  it('registers global columns synchronously so they are available on the first render', async () => {
    const wrapper = mount(GlobalTable, {
      global: { plugins: [[plugin, { registerGlobally: true }]] },
    })
    await nextTick()
    expect(wrapper.findComponent(Root).props('controller').columns).toHaveLength(1)
    expect(wrapper.text()).toContain('Anna')
    wrapper.unmount()
  })

  it('keeps SSR apps independent and performs no remote work during server rendering', async () => {
    const first = createSSRApp(Consumer).use(plugin, { csrfToken: 'first' })
    const second = createSSRApp(Consumer).use(plugin)
    expect(await renderToString(first)).toContain('first')
    expect(await renderToString(second)).toContain('empty')
    const events: unknown[] = []
    const app = createSSRApp(DataTable, {
      rowKey: 'id',
      url: '/users',
      onRequestStart: (event: unknown) => events.push(event),
    })
    await renderToString(app)
    expect(events).toEqual([])
  })
})
