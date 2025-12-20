import Vue, { getCurrentInstance } from 'vue'
import { VNode } from 'vue/types/vnode'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'

export const extractColumnNodes = () => {
  const instance = getCurrentInstance() as { proxy: Vue }

  if (!instance || !instance.proxy) {
    throw new VueDatatables182Error('error on getting component instance')
  }

  const { proxy } = instance

  const defaultSlot = proxy.$scopedSlots.default

  return defaultSlot ? (defaultSlot({}) as VNode[]) : []
}
