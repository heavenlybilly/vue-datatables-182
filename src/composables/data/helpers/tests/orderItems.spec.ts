import { DTOrderDirection, DTRowItem } from '@/types'
import orderItems from '../orderItems'

type TCase = {
  description: string
  items: DTRowItem[]
  orderBy: string
  orderDirection: DTOrderDirection
  expected: DTRowItem[]
}

const cases: TCase[] = [
  {
    description: 'Сортировка ASC',
    items: [
      { title: 'test3', order: 3 },
      { title: 'test1', order: 1 },
      { title: 'test2', order: 2 },
    ],
    orderBy: 'order',
    orderDirection: 'asc',
    expected: [
      { title: 'test1', order: 1 },
      { title: 'test2', order: 2 },
      { title: 'test3', order: 3 },
    ],
  },
  {
    description: 'Сортировка DESC',
    items: [
      { title: 'test2', order: 2 },
      { title: 'test1', order: 1 },
      { title: 'test4', order: 4 },
      { title: 'test3', order: 3 },
    ],
    orderBy: 'title',
    orderDirection: 'desc',
    expected: [
      { title: 'test4', order: 4 },
      { title: 'test3', order: 3 },
      { title: 'test2', order: 2 },
      { title: 'test1', order: 1 },
    ],
  },
  {
    description: 'Сортировка ASC nulls last',
    items: [
      { title: 'test2', order: 2 },
      { title: null, order: 1 },
      { title: 'test4', order: 4 },
      { title: null, order: 3 },
    ],
    orderBy: 'title',
    orderDirection: 'asc',
    expected: [
      { title: 'test2', order: 2 },
      { title: 'test4', order: 4 },
      { title: null, order: 1 },
      { title: null, order: 3 },
    ],
  },
  {
    description: 'Сортировка DESC nulls last',
    items: [
      { title: 'test2', order: 2 },
      { title: 'test1', order: null },
      { title: 'test4', order: 4 },
      { title: 'test3', order: null },
    ],
    orderBy: 'order',
    orderDirection: 'desc',
    expected: [
      { title: 'test4', order: 4 },
      { title: 'test2', order: 2 },
      { title: 'test1', order: null },
      { title: 'test3', order: null },
    ],
  },
]

describe('debounce', () => {
  cases.forEach((item) => {
    it(item.description, () => {
      const actual = orderItems(item.items, item.orderBy, item.orderDirection)
      const { expected } = item

      expect(actual).toEqual(expected)
    })
  })
})
