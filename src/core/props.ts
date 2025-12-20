import { ExtractPropTypes, PropType } from 'vue'
import { DTMethod, DTOrderDirection, DTSource } from '@/types'
import { Logger } from '@/logger'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'
import { props as dataSourceProps } from '@/features/data-params'

export const props = {
  ...dataSourceProps,
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
  showRangeInfo: {
    type: Boolean,
    default: true,
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
    default: DTOrderDirection.ASC,
  },
  // row-selection
  rowSelection: {
    type: Boolean,
    default: false,
  },
  disallowSelectAll: {
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
  // rows clickable
  rowsClickable: {
    type: Boolean,
    default: false,
  },
  selectOnRowClick: {
    type: Boolean,
    default: false,
  },
  // appearance
  scrollX: {
    type: Boolean,
    default: false,
  },
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
  stickyHeader: {
    type: Boolean,
    default: false,
  },
  verticalBorders: {
    type: Boolean,
    default: false,
  },
}

export const validateTableProps = (p: ExtractPropTypes<typeof props>) => {
  if (!p.rowsPerPageOptions.includes(p.rowsPerPageCount)) {
    Logger.error(`prop 'rowsPerPageCount' is not present in prop 'rowsPerPageOptions'`)
  }

  if (!p.scrollX && (p.fixedColumnsStart || p.fixedColumnsEnd)) {
    Logger.warn(
      `the props 'fixedColumnsStart' and 'fixedColumnsEnd' may only be set when the 'scrollX' prop is true`,
    )
  }

  const availableMethods: DTMethod[] = [DTMethod.GET, DTMethod.POST]
  if (p.method !== null && !availableMethods.includes(p.method)) {
    throw new VueDatatables182Error(
      ErrorCategory.PROPS_VALIDATION,
      `prop 'method' must be either “GET” or “POST”`,
    )
  }

  if (p.source === DTSource.REMOTE && !p.url) {
    throw new VueDatatables182Error(
      ErrorCategory.PROPS_VALIDATION,
      `if ‘remote’ is used as the source, the ‘url’ prop must be set`,
    )
  }
}
