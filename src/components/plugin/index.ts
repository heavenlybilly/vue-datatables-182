import type { App } from 'vue'
import DataTable from '../DataTable.vue'
import DataTableColumn from '../DataTableColumn.vue'
import { pluginConfigurationKey } from './configuration'
import type { PluginOptions } from './types'

const VueDatatables182 = {
  install(app: App, options: PluginOptions = {}) {
    const { registerGlobally, csrfToken, requestAdapter, responseAdapter, messages } = options

    app.provide(
      pluginConfigurationKey,
      Object.freeze({
        csrfToken,
        requestAdapter,
        responseAdapter,
        messages: messages
          ? Object.freeze({
              ...messages,
            })
          : undefined,
      }),
    )

    if (registerGlobally) {
      app.component('DataTable', DataTable)
      app.component('DataTableColumn', DataTableColumn)
    }
  },
}

export default VueDatatables182
