import { DomainError } from '@/DomainError'
import { DTDataSource, DTOrderDirection, DTRowItem, DTTableProps } from '@/types'
import { PropType } from 'vue'

export const tableProps = {
  // data
  dataSource: {
    type: String as PropType<DTDataSource>,
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

export const validateTableProps = (props: DTTableProps) => {
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
}
