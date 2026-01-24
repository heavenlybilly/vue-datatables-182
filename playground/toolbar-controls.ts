import { books } from '~/mocks/mocks'
import { ControlType, ToolbarGroup } from '~/types'
import { Logger } from '~/utils/logger'
import { SortDirection, Source } from '@/components/types'

export const toolbarControls: ToolbarGroup[] = [
  {
    title: 'Data',
    controls: [
      {
        type: ControlType.SELECT,
        name: 'source',
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
      },
      {
        type: ControlType.CODE,
        name: 'filter',
      },
      {
        type: ControlType.CODE,
        name: 'items',
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
      },
      {
        type: ControlType.CODE,
        name: 'responseAdapter',
      },
    ],
  },
  {
    title: 'Pagination',
    controls: [
      {
        type: ControlType.SWITCHER,
        name: 'pagination',
      },
      {
        type: ControlType.NUMBER,
        name: 'rowsPerPageCount',
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
      },
    ],
  },
  {
    title: 'Sort',
    controls: [
      {
        type: ControlType.STRING,
        name: 'sortBy',
      },
      {
        type: ControlType.SELECT,
        name: 'sortDirection',
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
        params: {
          defaultValue: 'id',
        },
      },
      {
        type: ControlType.SWITCHER,
        name: 'selection',
      },
      {
        type: ControlType.SWITCHER,
        name: 'allowSelectAll',
      },
      {
        type: ControlType.NUMBER,
        name: 'selectionLimit',
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
      },
      {
        type: ControlType.SWITCHER,
        name: 'selectOnRowClick',
      },
      {
        type: ControlType.SWITCHER,
        name: 'showPageDetails',
      },
      {
        type: ControlType.SWITCHER,
        name: 'scrollX',
      },
      {
        type: ControlType.SWITCHER,
        name: 'stickyHeader',
      },
      {
        type: ControlType.SWITCHER,
        name: 'verticalBorders',
      },
      {
        type: ControlType.SWITCHER,
        name: 'striped',
      },
      {
        type: ControlType.SWITCHER,
        name: 'numbering',
      },
    ],
  },
]
