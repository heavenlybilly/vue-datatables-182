import { createTypedTable } from 'vue-datatables-182'

type Item = {
  id: number
  name: string
  balance: number
}

const { DataTable, DataTableColumn } = createTypedTable<Item>()

type Table = InstanceType<typeof DataTable>

type Column = InstanceType<typeof DataTableColumn>

export function checkTypedTable(table: Table, column: Column) {
  table.$props.items?.forEach((item) => item.balance.toFixed(2))
  table.$emit('rowClick', {
    key: 1,
    item: {
      id: 1,
      name: 'Alice',
      balance: 10,
    },
  })
  table.clearSelection()

  const reload: Promise<void> = table.reload()
  const { cell } = column.$slots

  cell?.({
    item: {
      id: 1,
      name: 'Alice',
      balance: 10,
    },
    key: 1,
    index: 0,
    number: 1,
  })

  table.$emit('rowClick', {
    key: 1,
    // @ts-expect-error Row payload must include balance.
    item: {
      id: 1,
      name: 'Alice',
    },
  })

  // @ts-expect-error Selection payload must contain Item rows.
  table.$emit('selectionChange', {
    keys: [1],
    items: [
      {
        id: 1,
      },
    ],
  })

  // @ts-expect-error Request results must contain Item rows.
  table.$emit('requestSuccess', {
    requestId: 1,
    data: {
      items: [{}],
      total: 1,
      filtered: 1,
    },
  })

  // @ts-expect-error Unknown row fields are rejected.
  const field: Column['$props']['field'] = 'missing'
  // @ts-expect-error Row key must reference an Item field.
  const key: Table['$props']['rowKey'] = 'missing'

  cell?.({
    // @ts-expect-error Cell slots require an Item.
    item: {
      id: 1,
    },
    key: 1,
    index: 0,
    number: 1,
  })

  const items: Table['$props']['items'] = [
    // @ts-expect-error Items must match Item.
    {
      id: 1,
    },
  ]

  // @ts-expect-error value receives Item, not a string.
  const value: Column['$props']['value'] = (item: string) => item

  return {
    reload,
    field,
    key,
    items,
    value,
  }
}
