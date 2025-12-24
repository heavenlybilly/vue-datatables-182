import { RequestAdapter, ResponseAdapter } from '@/components/types'

export interface PluginConf {
  csrfToken?: string
  requestAdapter?: RequestAdapter
  responseAdapter?: ResponseAdapter
}

export interface PluginOptions {
  readonly registerGlobally?: boolean
  readonly csrfToken?: string
  readonly requestAdapter?: RequestAdapter
  readonly responseAdapter?: ResponseAdapter
}
