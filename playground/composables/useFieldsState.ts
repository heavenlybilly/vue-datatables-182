import { FieldDef } from '~/types'
import { DTSource } from '@/types'

export const useFieldsState = () => {
  const retrieveFieldsState = (source: DTSource): FieldDef[] => {
    const saved = localStorage.getItem(`playground-fields-${source}`)

    if (saved) {
      return JSON.parse(saved) as FieldDef[]
    }

    return []
  }

  const storeFieldsState = (source: DTSource, fields: FieldDef[]) => {
    localStorage.setItem(`playground-fields-${source}`, JSON.stringify(fields))
  }

  return {
    retrieveFieldsState,
    storeFieldsState,
  }
}
