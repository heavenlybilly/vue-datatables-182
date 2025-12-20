import { inject } from 'vue'
import type { InjectionKey } from 'vue'
import type { PluginConf } from './types'

export const pluginConfigurationKey: InjectionKey<Readonly<PluginConf>> =
  Symbol('DataTable options')

export const usePluginConfiguration = () => inject(pluginConfigurationKey, {})
