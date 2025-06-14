import { DataTable, DataTableColumn } from '@/index'
import type { PluginFunction } from 'vue'
import { DTMethod, DTPluginOptions } from '@/types/types'
import { setCsrfToken } from '@/plugin/csrf-token'
import { setDefaultMethod } from '@/plugin/default-method'

const VueDatatables182: { install: PluginFunction<DTPluginOptions> } = {
  install(Vue, options = { registerGlobally: true, defaultMethod: DTMethod.GET }) {
    if (options.registerGlobally || options?.registerGlobally === undefined) {
      Vue.component('DataTable', DataTable)
      Vue.component('DataTableColumn', DataTableColumn)
    }

    if (options?.csrfToken) {
      setCsrfToken(options.csrfToken)
    }

    if (options?.defaultMethod) {
      setDefaultMethod(options.defaultMethod ?? DTMethod.GET)
    }
  },
}

export default VueDatatables182
