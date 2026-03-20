import { books } from '~/mocks/mocks'
import { ControlType, ToolbarGroup } from '~/types'
import { Logger } from '~/utils/logger'
import { SortDirection, Source } from '@/components/types'

const compileFunction = (value?: string): ((...args: unknown[]) => unknown) | undefined => {
  if (!value?.trim()) return undefined
  try {
    // eslint-disable-next-line no-new-func
    return new Function(`return (${value})`)() as (...args: unknown[]) => unknown
  } catch (e) {
    Logger.red('adapter compiler', String(e))
    return undefined
  }
}

export const toolbarControls: ToolbarGroup[] = [
  {
    title: 'Data',
    controls: [
      {
        type: ControlType.SELECT,
        name: 'source',
        description: 'Источник данных: локальный массив или удалённый API',
        params: {
          defaultValue: Source.LOCAL,
        },
        props: {
          options: Object.values(Source),
        },
      },
      {
        type: ControlType.STRING,
        name: 'url',
        description: 'URL для удалённого источника данных',
      },
      {
        type: ControlType.CODE,
        name: 'filter',
        description: 'Объект фильтрации (JSON)',
      },
      {
        type: ControlType.CODE,
        name: 'items',
        description: 'Массив данных для локального источника (JSON)',
        params: {
          defaultValue: JSON.stringify(books, null, 2),
          normalizer: (value?: string) => {
            if (!value) {
              return undefined
            }

            return JSON.parse(value)
          },
        },
      },
      {
        type: ControlType.CODE,
        name: 'requestAdapter',
        description: 'Функция: (ctx) => { url, headers?, requestBody? }',
        params: {
          normalizer: compileFunction,
        },
      },
      {
        type: ControlType.CODE,
        name: 'responseAdapter',
        description: 'Функция: (response) => { items, total, filtered? }',
        params: {
          normalizer: compileFunction,
        },
      },
    ],
  },
  {
    title: 'Pagination',
    controls: [
      {
        type: ControlType.SWITCHER,
        name: 'pagination',
        description: 'Включить пагинацию',
      },
      {
        type: ControlType.NUMBER,
        name: 'rowsPerPageCount',
        description: 'Количество строк на странице',
        params: {
          defaultValue: 10,
          normalizer: (value?: string) => {
            if (value !== undefined && Number.isInteger(+value) && +value > 0) {
              return +value
            }

            Logger.red('rowsPerPageCount', 'invalid value of props: `undefined` will be returned')
            return undefined
          },
        },
      },
      {
        type: ControlType.STRING,
        name: 'rowsPerPageOptions',
        description: 'Варианты количества строк через запятую',
        params: {
          defaultValue: '10, 20, 25, 50',
          normalizer: (value?: string) => {
            if (!value) {
              return [10, 20, 25, 50]
            }

            return value
              .split(',')
              .map((item) => +item.trim())
              .filter((num) => Number.isInteger(num) && num > 0)
          },
        },
      },
    ],
  },
  {
    title: 'Search',
    controls: [
      {
        type: ControlType.SWITCHER,
        name: 'search',
        description: 'Включить поиск',
      },
    ],
  },
  {
    title: 'Sort',
    controls: [
      {
        type: ControlType.STRING,
        name: 'sortBy',
        description: 'Имя поля для сортировки',
      },
      {
        type: ControlType.SELECT,
        name: 'sortDirection',
        description: 'Направление сортировки',
        props: {
          options: Object.values(SortDirection),
        },
      },
    ],
  },
  {
    title: 'Rows & Selection & Click',
    controls: [
      {
        type: ControlType.STRING,
        name: 'rowKey',
        description: 'Уникальный ключ строки (поле объекта)',
        params: {
          defaultValue: 'id',
        },
      },
      {
        type: ControlType.SWITCHER,
        name: 'selection',
        description: 'Включить выбор строк',
      },
      {
        type: ControlType.SWITCHER,
        name: 'allowSelectAll',
        description: 'Показать чекбокс «выбрать все»',
      },
      {
        type: ControlType.NUMBER,
        name: 'selectionLimit',
        description: 'Макс. количество выбранных строк',
        params: {
          normalizer: (value?: string) => {
            if (value !== undefined && Number.isInteger(+value) && +value > 0) {
              return +value
            }

            Logger.red('selectionLimit', 'invalid value of props: `undefined` will be returned')
            return undefined
          },
        },
      },
    ],
  },
  {
    title: 'Appearance',
    controls: [
      {
        type: ControlType.SWITCHER,
        name: 'rowsClickable',
        description: 'Сделать строки кликабельными',
      },
      {
        type: ControlType.SWITCHER,
        name: 'selectOnRowClick',
        description: 'Выбирать строку по клику',
      },
      {
        type: ControlType.SWITCHER,
        name: 'showPageDetails',
        description: 'Показать информацию о страницах',
      },
      {
        type: ControlType.SWITCHER,
        name: 'scrollX',
        description: 'Горизонтальная прокрутка',
      },
      {
        type: ControlType.SWITCHER,
        name: 'stickyHeader',
        description: 'Фиксированная шапка при прокрутке',
      },
      {
        type: ControlType.SWITCHER,
        name: 'verticalBorders',
        description: 'Вертикальные границы между ячейками',
      },
      {
        type: ControlType.SWITCHER,
        name: 'striped',
        description: 'Чередующиеся цвета строк',
      },
      {
        type: ControlType.SWITCHER,
        name: 'numbering',
        description: 'Нумерация строк',
      },
    ],
  },
]
