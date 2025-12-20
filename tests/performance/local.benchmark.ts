import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, version } from 'vue'
import { DataTable, DataTableColumn, Source } from '../../src'
import { createLocalTable } from '../helpers/local-table'

const columns = () => [h(DataTableColumn, { field: 'value', searchable: true, sortable: true })]
const rows = (count: number) =>
  Array.from({ length: count }, (_, id) => ({
    id,
    value: `Row ${String(count - id).padStart(6, '0')}`,
  }))

function measure(run: () => void) {
  run()
  const samples = Array.from({ length: 5 }, () => {
    const start = performance.now()
    run()
    return performance.now() - start
  }).sort((a, b) => a - b)
  return Number(samples[2].toFixed(2))
}

describe('local data benchmark, median of five warmed runs', () => {
  it.each([1000, 10000, 50000])('%i source rows with 25 visible rows', (count) => {
    const items = rows(count)
    const table = createLocalTable({
      items,
      defaultSearchQuery: 'Row',
      defaultSort: { by: 'value', direction: 'asc' },
      defaultRowsPerPageCount: 25,
    })
    const processingMs = measure(() => table.adapter.apply())
    const mountMs = measure(() => {
      const wrapper = mount(DataTable, {
        props: { rowKey: 'id', source: Source.LOCAL, items, defaultRowsPerPageCount: 25 },
        slots: { default: columns },
      })
      expect(wrapper.findAll('.dt182-row')).toHaveLength(25)
      wrapper.unmount()
    })
    process.stdout.write(
      `${JSON.stringify({ vue: version, count, visible: 25, processingMs, mountMs })}\n`,
    )
  })

  it('1000 rows without pagination', () => {
    const items = rows(1000)
    const mountMs = measure(() => {
      const wrapper = mount(DataTable, {
        props: { rowKey: 'id', source: Source.LOCAL, items, pagination: false },
        slots: { default: columns },
      })
      expect(wrapper.findAll('.dt182-row')).toHaveLength(1000)
      wrapper.unmount()
    })
    process.stdout.write(
      `${JSON.stringify({ vue: version, count: 1000, visible: 1000, mountMs })}\n`,
    )
  })
})
