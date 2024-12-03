import { ExtractPropTypes, PropType } from 'vue'
import { DTMethod, DTOrderDirection, DTRowItem, DTSource } from '@/types/types'
import { DomainError } from '@/errors/DomainError'

export const tableProps = {
  // data
  source: {
    type: String as PropType<DTSource>,
    default: 'server',
  },
  url: {
    type: String as PropType<string | null>,
    default: null,
  },
  items: {
    type: Array as PropType<DTRowItem[]>,
    default: () => [],
  },
  method: {
    type: String as PropType<DTMethod>,
    default: 'GET',
  },
  // pagination
  pagination: {
    type: Boolean,
    default: true,
  },
  rowsPerPageCount: {
    type: Number,
    default: 10,
  },
  rowsPerPageOptions: {
    type: Array as PropType<number[]>,
    default: () => [5, 10, 25, 50, 100],
  },
  // search
  searching: {
    type: Boolean,
    default: true,
  },
  // order
  orderBy: {
    type: String as PropType<string | null>,
    default: null,
  },
  orderDirection: {
    type: String as PropType<DTOrderDirection>,
    default: 'asc',
  },
  // row-selection
  rowSelection: {
    type: Boolean,
    default: false,
  },
  // actions
  actions: {
    type: Boolean,
    default: false,
  },
  // numbering
  numbering: {
    type: Boolean,
    default: false,
  },
  // scrollX
  scrollX: {
    type: Boolean,
    default: false,
  },
  // fixed columns
  fixedColumnsStart: {
    type: Number,
    required: false,
    default: 0,
  },
  fixedColumnsEnd: {
    type: Number,
    required: false,
    default: 0,
  },
  // rows clickable
  rowsClickable: {
    type: Boolean,
    default: false,
  },
}

export const validateTableProps = (props: ExtractPropTypes<typeof tableProps>) => {
  if (!props.rowsPerPageOptions.includes(props.rowsPerPageCount)) {
    throw new DomainError(
      'Invalid props declaration',
      'Prop rowsPerPageCount is not present in prop rowsPerPageOptions',
    )
  }

  if (!props.scrollX && (props.fixedColumnsStart || props.fixedColumnsEnd)) {
    throw new DomainError(
      'Invalid props declaration',
      'The props fixedColumnsStart and fixedColumnsEnd may only be set when the scrollX prop is true',
    )
  }

  const availableMethods: DTMethod[] = ['GET', 'POST']
  if (!availableMethods.includes(props.method)) {
    throw new DomainError(
      'Некорректное значение пропса method',
      'Доступные значения "GET" и "POST"',
    )
  }
}
