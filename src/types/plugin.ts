import type { TableMessages } from './messages'
import type { RequestAdapter, ResponseAdapter } from './remote'

export interface PluginOptions {
  readonly messages?: Partial<TableMessages>
  readonly registerGlobally?: boolean
  readonly csrfToken?: string
  readonly requestAdapter?: RequestAdapter
  readonly responseAdapter?: ResponseAdapter
}
