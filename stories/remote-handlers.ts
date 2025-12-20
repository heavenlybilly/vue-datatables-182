import { HttpResponse, delay, http } from 'msw'
import { rows } from './rows'

type Query = {
  page?: number
  perPage?: number
  search?: string
  sortBy?: string
  sortDirection?: string
}

export function remoteHandlers(mode: 'normal' | 'slow' | 'error' | 'retry' | 'empty') {
  let failed = false
  return [
    http.post('/storybook-api/rows', async ({ request }) => {
      const query = (await request.json()) as Query
      await delay(mode === 'slow' ? 2500 : 350)
      if (mode === 'error' || (mode === 'retry' && !failed)) {
        failed = true
        return HttpResponse.json({ message: 'Ошибка демонстрационного сервера' }, { status: 503 })
      }
      const source = mode === 'empty' ? [] : rows
      const search = query.search?.toLowerCase() ?? ''
      const filtered = source.filter((row) =>
        `${row.name} ${row.category}`.toLowerCase().includes(search),
      )
      const { sortBy } = query
      if (sortBy === 'name' || sortBy === 'category' || sortBy === 'amount') {
        filtered.sort((a, b) => {
          const direction = query.sortDirection === 'desc' ? -1 : 1
          if (a[sortBy] === b[sortBy]) return 0
          return (a[sortBy] < b[sortBy] ? -1 : 1) * direction
        })
      }
      const start = ((query.page ?? 1) - 1) * (query.perPage ?? filtered.length)
      const items = filtered.slice(start, start + (query.perPage ?? filtered.length))
      return HttpResponse.json({ items, total: source.length, filtered: filtered.length })
    }),
  ]
}
