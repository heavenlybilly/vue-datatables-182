import type { PluginOptions } from '../../types'

export type { PluginOptions } from '../../types'

export type PluginConf = Omit<PluginOptions, 'registerGlobally'>
