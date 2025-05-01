import { DTMethod } from '@/types/types'

let defaultMethod: DTMethod | undefined

export const setDefaultMethod = (value: DTMethod) => {
  defaultMethod = value
}

export const getDefaultMethod = () => defaultMethod
