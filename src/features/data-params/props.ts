import { PropType } from 'vue'
import { DTFilter, DTMethod, DTRowItem, DTSource } from '@/types'

export const props = {
  source: {
    type: String as PropType<DTSource>,
    default: DTSource.REMOTE,
  },
  url: {
    type: String as PropType<string | null>,
    default: null,
  },
  filters: {
    type: Object as PropType<DTFilter>,
    default: () => {},
  },
  items: {
    type: Array as PropType<DTRowItem[]>,
    default: () => [],
  },
  method: {
    type: String as PropType<DTMethod>,
    default: DTMethod.POST,
  },
}
