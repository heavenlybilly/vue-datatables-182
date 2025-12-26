import { ColumnRegistry } from '../columns/types'
import { Core } from '../core/types'
import {
  RequestAdapter,
  RequestEndPayload,
  RequestErrorPayload,
  RequestStartPayload,
  RequestSuccessPayload,
  ResponseAdapter,
  RowItem,
  Source,
  TableFilter,
} from '../types'

/**
 * Adapter's options
 */
export interface LocalAdapterOptions {
  core: Core
  columnRegistry: ColumnRegistry<RowItem>

  getLocalItems: () => RowItem[]
}

export interface RemoteAdapterOptions {
  core: Core
  columnRegistry: ColumnRegistry<RowItem>

  getUrl: () => string | undefined
  getFilter: () => TableFilter
  getRequestAdapter: () => RequestAdapter | undefined
  getResponseAdapter: () => ResponseAdapter | undefined
  getCsrfToken: () => string | undefined

  emit: {
    (e: 'requestStart', payload: RequestStartPayload): void
    (e: 'requestEnd', payload: RequestEndPayload): void
    (e: 'requestError', payload: RequestErrorPayload): void
    (e: 'requestSuccess', payload: RequestSuccessPayload): void
  }
}

/**
 * Data provider options
 * */
export interface DataProviderOptions extends LocalAdapterOptions, RemoteAdapterOptions {
  getSource: () => Source | undefined
}

export interface DataProvider {
  apply(): void
  reload(): void | Promise<void>
}
