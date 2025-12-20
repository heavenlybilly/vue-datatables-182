import { InjectionKey, Ref } from 'vue'
import { DTColumn } from '@/types'

export const contextKey = Symbol('columns-schema') as InjectionKey<{
  columns: Readonly<Ref<DTColumn[]>>
}>
