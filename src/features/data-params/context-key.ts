import { InjectionKey, Ref } from 'vue'
import { DTFilter, DTMethod, DTOrderDirection, DTRowItem, DTSource } from '@/types'

export interface BaseContext {
  method: Readonly<DTMethod>
  filters: Readonly<DTFilter>
  page: Readonly<Ref<number>>
  rowsPerPage: Readonly<Ref<number>>
  searchQuery: Readonly<Ref<string | null>>
  order: Readonly<
    Ref<{
      by: string
      direction: DTOrderDirection
    } | null>
  >
  setSearchQuery: (value: string | null) => void
  setPage: (value: number) => void
  setRowsPerPage: (value: number) => void
  setOrderBy: (value: string | null) => void
  setOrderDirection: (value: DTOrderDirection) => void
}

interface RemoteContext extends BaseContext {
  source: typeof DTSource.REMOTE
  url: string
}

interface LocalContext extends BaseContext {
  source: typeof DTSource.LOCAL
  items: DTRowItem[]
}

type Context = RemoteContext | LocalContext

type ToReadonly<T> = T extends any ? { readonly [K in keyof T]: Readonly<T[K]> } : never

export const contextKey = Symbol('data-source') as InjectionKey<ToReadonly<Context>>
