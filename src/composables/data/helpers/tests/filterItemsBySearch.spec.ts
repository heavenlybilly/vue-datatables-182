import filterItemsBySearch from '../filterItemsBySearch'

const dataProvider = {
  cases: [
    {
      description: 'Пустой запрос',
      search: '',
      items: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
      searchableColumnNames: ['title'],
      expected: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
    },
    {
      description: 'Нет столбцов для поиска',
      search: 'test',
      items: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
      searchableColumnNames: [],
      expected: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
    },
    {
      description: 'Полное совпадение',
      search: 'Test',
      items: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
      searchableColumnNames: ['title'],
      expected: [{ title: 'test1' }, { title: 'test2' }, { title: 'test3' }],
    },
    {
      description: 'Сортировка по двум столбцам',
      search: '2',
      items: [
        { id: 1, title: 'test12', order: 1 },
        { id: 2, title: 'test', order: 2 },
        { id: 3, title: 'test33', order: 3 },
      ],
      searchableColumnNames: ['title', 'order'],
      expected: [
        { id: 1, title: 'test12', order: 1 },
        { id: 2, title: 'test', order: 2 },
      ],
    },
  ],
}

describe('debounce', () => {
  dataProvider.cases.forEach((item) => {
    it(item.description, () => {
      const actual = filterItemsBySearch(item.items, item.search, item.searchableColumnNames)
      const { expected } = item

      expect(actual).toEqual(expected)
    })
  })
})
