import { DTOrder } from '@/types'
import { Ref, ref } from 'vue'

export const useOrder = () => {
  const order: Ref<DTOrder | null> = ref(null)

  const setOrder = (value: DTOrder) => {
    order.value = value
  }

  const resetOrder = () => {
    order.value = null
  }

  return {
    order,
    setOrder,
    resetOrder,
  }
}
