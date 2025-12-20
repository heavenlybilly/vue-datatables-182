import type { TableMessages } from '../../types/messages'

const records = (count: number) => (count % 10 === 1 && count % 100 !== 11 ? 'записи' : 'записей')

export const defaultMessages: Readonly<TableMessages> = Object.freeze({
  tableLabel: 'Таблица данных',
  search: 'Поиск',
  searchPlaceholder: 'Введите для поиска',
  clearSearch: 'Очистить поиск',
  rowsPerPage: 'Записей на странице',
  pagination: 'Навигация по страницам',
  firstPage: 'Первая страница',
  previousPage: 'Предыдущая страница',
  nextPage: 'Следующая страница',
  lastPage: 'Последняя страница',
  page: (page: number) => `Страница ${page}`,
  sort: (title: string) => `Сортировать: ${title}`,
  selectAll: 'Выбрать все видимые строки',
  selectRow: (number: number) => `Выбрать строку ${number}`,
  activateRow: (number: number) => `Открыть строку ${number}`,
  numbering: 'Номер строки',
  selection: 'Выбор строк',
  loading: 'Загрузка…',
  empty: 'Нет данных.',
  noResults: 'Ничего не найдено.',
  error: 'Не удалось загрузить данные.',
  retry: 'Повторить',
  pageDetails: ({ start, end, filtered, total }) => {
    const range = `Записи с ${start} до ${end} из ${filtered} ${records(filtered)}`

    return total === filtered ? range : `${range} (из ${total} ${records(total)})`
  },
})
