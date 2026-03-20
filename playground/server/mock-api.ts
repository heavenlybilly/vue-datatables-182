import type { IncomingMessage, ServerResponse } from 'http'
import type { Plugin } from 'vite'
import { books } from '../mocks/mocks'

function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        resolve({})
      }
    })
  })
}

function sendJson(res: ServerResponse, data: unknown, status = 200) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN')
  res.end(JSON.stringify(data))
}

export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api/books', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-TOKEN')
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method !== 'POST') {
          sendJson(res, { error: 'Method not allowed' }, 405)
          return
        }

        const params = await parseBody(req)
        const page = Number(params.page) || 1
        const perPage = Number(params.perPage) || 10
        const search = params.search as string | undefined
        const sortBy = params.sortBy as string | undefined
        const sortDirection = (params.sortDirection as string) || 'asc'

        let filtered = [...books]

        if (search?.trim()) {
          const q = search.toLowerCase()
          filtered = filtered.filter((book) =>
            Object.values(book).some((val) => String(val).toLowerCase().includes(q)),
          )
        }

        if (sortBy && sortBy in books[0]) {
          filtered.sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[sortBy]
            const bVal = (b as Record<string, unknown>)[sortBy]
            if (aVal == null || bVal == null) return 0
            if (aVal < bVal) return sortDirection === 'desc' ? 1 : -1
            if (aVal > bVal) return sortDirection === 'desc' ? -1 : 1
            return 0
          })
        }

        const total = books.length
        const totalFiltered = filtered.length
        const start = (page - 1) * perPage
        const data = filtered.slice(start, start + perPage)

        sendJson(res, {
          data,
          total,
          filtered: totalFiltered,
          page,
          perPage,
        })
      })
    },
  }
}
