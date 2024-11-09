import getItemsByPage from '../getItemsByPage'

const dataProvider = {
  cases: [
    {
      description: 'Элементов для отображения нет',
      items: [],
      page: 1,
      rowsPerPage: 25,
      expected: [],
    },
    {
      description: 'Первая страница, пять элементов',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20],
      page: 1,
      rowsPerPage: 5,
      expected: [1, 2, 3, 4, 5],
    },
    {
      description: 'Вторая страница, пять элементов',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20],
      page: 2,
      rowsPerPage: 5,
      expected: [6, 7, 8, 9, 10],
    },
    {
      description: 'Вторая страница, 15 элементов',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20],
      page: 2,
      rowsPerPage: 15,
      expected: [16, 17, 18, 18, 20],
    },
    {
      description: 'Шестая страница, 5 элементов',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 20],
      page: 6,
      rowsPerPage: 5,
      expected: [],
    },
  ],
}

describe('debounce', () => {
  dataProvider.cases.forEach((item) => {
    it(item.description, () => {
      const actual = getItemsByPage(item.items, item.page, item.rowsPerPage)
      const { expected } = item

      expect(actual).toEqual(expected)
    })
  })
})
