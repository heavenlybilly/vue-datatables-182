import { DTDataSource, DTOrderDirection, DTRowItem } from '@/types'
import { ExtractPropTypes, PropType } from 'vue'

export const componentProps = {
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
    default: 25,
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
    required: false,
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
}

type TComponentProps = ExtractPropTypes<typeof componentProps>

export const validateProps = (props: TComponentProps) => {
  if (!props.rowsPerPageOptions.includes(props.rowsPerPageCount)) {
    throw new Error('Prop rowsPerPageCount is not present in prop rowsPerPageOptions')
  }
}
