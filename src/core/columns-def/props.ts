import { PropType } from 'vue'
import { DTTextAlign } from '@/types/types'

export const props = {
  field: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  orderable: {
    type: Boolean,
    required: false,
    default: false,
  },
  searchable: {
    type: Boolean,
    required: false,
    default: false,
  },
  width: {
    type: String,
    required: false,
    default: undefined,
  },
  textAlign: {
    type: String as PropType<DTTextAlign>,
    required: false,
    default: undefined,
  },
}
