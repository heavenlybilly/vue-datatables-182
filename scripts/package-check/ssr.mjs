import assert from 'node:assert/strict'
import { createSSRApp, h } from 'vue'
import {
  DataTable,
  DataTableColumn,
  defaultRequestAdapter,
  defaultResponseAdapter,
} from 'vue-datatables-182'
import { renderToString } from 'vue/server-renderer'

assert.equal(typeof window, 'undefined')

assert.equal(typeof document, 'undefined')

assert.equal(
  defaultRequestAdapter({
    url: '/rows',
    pagination: false,
    requestBody: {},
  }).method,
  'POST',
)

assert.deepEqual(
  defaultResponseAdapter({
    items: [],
    total: 0,
  }),
  {
    items: [],
    total: 0,
  },
)

const local = await renderToString(
  createSSRApp({
    render: () =>
      h(
        DataTable,
        {
          rowKey: 'id',
          source: 'local',
          items: [
            {
              id: 1,
              name: 'SSR row',
            },
          ],
        },
        {
          default: () =>
            h(DataTableColumn, {
              field: 'name',
              title: 'SSR header',
            }),
        },
      ),
  }),
)

assert.ok(local.includes('SSR row'))

assert.ok(local.includes('SSR header'))

const originalFetch = globalThis.fetch
let requests = 0

globalThis.fetch = async () => {
  requests += 1

  throw new Error('Fetch during SSR')
}

try {
  await renderToString(
    createSSRApp({
      render: () =>
        h(DataTable, {
          rowKey: 'id',
          url: 'https://example.invalid/rows',
        }),
    }),
  )
  assert.equal(requests, 0)
} finally {
  globalThis.fetch = originalFetch
}

process.stdout.write('Installed package: ESM, adapters and local/remote SSR passed\n')
