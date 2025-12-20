import { describe, expect, it } from 'vitest'
import { DataTable, DataTableColumn, createTypedTable } from '../src'

describe('createTypedTable', () => {
  it('preserves the runtime components across row types', () => {
    const users = createTypedTable<{ id: number; name: string }>()
    const products = createTypedTable<{ sku: string; price: number }>()
    expect(users.DataTable).toBe(DataTable)
    expect(users.DataTableColumn).toBe(DataTableColumn)
    expect(products.DataTable).toBe(users.DataTable)
    expect(products.DataTableColumn).toBe(users.DataTableColumn)
  })
})
