import {
  type DataTableEmits,
  type DataTableSlots,
  type RequestAdapter,
  type ResponseAdapter,
  defaultMessages,
  defaultRequestAdapter,
  defaultResponseAdapter,
} from 'vue-datatables-182'

const request: RequestAdapter = defaultRequestAdapter
const response: ResponseAdapter = defaultResponseAdapter
export const adapters = {
  request,
  response,
  messages: defaultMessages,
}

export function checkEvents(emit: DataTableEmits) {
  emit('update:page', 2)
  emit('selectionChange', {
    keys: [1],
    items: [
      {
        id: 1,
      },
    ],
  })
  emit('requestError', {
    requestId: 1,
    error: new Error('Request failed'),
  })
}

export const slots: DataTableSlots = {
  error: () => [],
}
