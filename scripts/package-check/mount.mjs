import { JSDOM } from 'jsdom'
import assert from 'node:assert/strict'

const dom = new JSDOM('<div id="app"></div>', {
  url: 'http://localhost',
})

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Element: dom.window.Element,
  HTMLElement: dom.window.HTMLElement,
  SVGElement: dom.window.SVGElement,
})

const { createApp, createSSRApp, h, nextTick } = await import('vue')
const { renderToString } = await import('vue/server-renderer')
const { DataTable, DataTableColumn } = await import('vue-datatables-182')
const localComponent = {
  render: () =>
    h(
      DataTable,
      {
        source: 'local',
        rowKey: 'id',
        items: [
          {
            id: 1,
            name: 'Hydrated row',
          },
        ],
      },
      {
        default: () =>
          h(DataTableColumn, {
            field: 'name',
            title: 'Name',
          }),
      },
    ),
}

document.querySelector('#app').innerHTML = await renderToString(createSSRApp(localComponent))

const hydrated = createSSRApp(localComponent)
const warnings = []

hydrated.config.warnHandler = (message) => warnings.push(message)

hydrated.mount('#app')

await nextTick()

assert.deepEqual(warnings, [])

assert.ok(document.querySelector('#app').textContent.includes('Hydrated row'))

hydrated.unmount()

let requests = 0
const originalFetch = globalThis.fetch

globalThis.fetch = async () => {
  requests += 1

  return new Response(
    JSON.stringify({
      items: [],
      total: 0,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

const app = createApp({
  render: () =>
    h(DataTable, {
      rowKey: 'id',
      url: '/rows',
    }),
})

try {
  assert.equal(requests, 0)

  app.mount('#app')

  await nextTick()

  assert.equal(requests, 1)

  process.stdout.write('Installed package: local hydration and remote fetch after mount passed\n')
} finally {
  app.unmount()

  dom.window.close()

  globalThis.fetch = originalFetch
}
