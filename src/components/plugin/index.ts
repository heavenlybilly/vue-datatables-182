import type { PluginObject } from 'vue'
import { PluginConf, PluginOptions } from './types'

const pluginConf: PluginConf = {
  csrfToken: undefined,
  requestAdapter: undefined,
  responseAdapter: undefined,
}

const plugin: PluginObject<PluginOptions> = {
  install: (Vue, options) => {
    if (!options) {
      return
    }

    const { registerGlobally, csrfToken, requestAdapter, responseAdapter } = options

    if (registerGlobally) {
      Vue.component('DataTable', () => import('../DataTable.vue'))
      Vue.component('DataTableColumn', () => import('../DataTableColumn.vue'))
    }

    if (csrfToken) {
      pluginConf.csrfToken = csrfToken
    }

    if (requestAdapter) {
      pluginConf.requestAdapter = requestAdapter
    }

    if (responseAdapter) {
      pluginConf.responseAdapter = responseAdapter
    }
  },
}

export const getPluginConf = () => pluginConf

export default plugin
