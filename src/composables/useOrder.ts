import { Ref, ref } from 'vue'
import { DTOrder } from '@/types/types'

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
