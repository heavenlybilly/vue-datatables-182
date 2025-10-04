import { DTColumn, DTFilter, DTMethod, DTOrder, DTRowItem, DTSource } from '@/types'
import { VueDatatables182Error } from '@/errors/VueDatatables182Error'
import { ErrorCategory } from '@/errors/error-categories'
import { getDefaultMethod } from '@/plugin/default-method'
import { processLocalItems } from '@/core/table-data/local'
import { fetchRemoteItems } from '@/core/table-data/remote'

export const retrieveTableData = async (options: {
  source: DTSource
  conf: {
    columns: DTColumn[]
    searching: boolean
    pagination: boolean
  }
  remoteConf: {
    url: string | null
    method: DTMethod | null
  }
  localConf: {
    items: DTRowItem[]
  }
  params: {
    search: string
    rowsPerPage: number
    page: number
    order: DTOrder | null
    filters: DTFilter | null
  }
}) => {
  switch (options.source) {
    case DTSource.REMOTE: {
      if (options?.remoteConf === undefined) {
        throw new VueDatatables182Error(
          ErrorCategory.INTERNAL_ERROR,
          '[retrieveTableData.ts] remoteConf was not provided',
        )
      }

      const method = options.remoteConf.method ?? getDefaultMethod()
      if (!method) {
        throw new VueDatatables182Error(
          ErrorCategory.INTERNAL_ERROR,
          '[retrieveTableData.ts] http method was not defined',
        )
      }

      const remoteConf = {
        method,
        url: options.remoteConf.url as string,
      }

      return fetchRemoteItems(remoteConf, options.conf, options.params)
    }
    case DTSource.LOCAL: {
      if (options?.localConf === undefined) {
        throw new VueDatatables182Error(
          ErrorCategory.INTERNAL_ERROR,
          '[retrieveTableData.ts] localConf was not provided',
        )
      }

      return processLocalItems(options.localConf, options.conf, options.params)
    }
    default: {
      const _: never = options.source
      throw new VueDatatables182Error(
        ErrorCategory.PROPS_VALIDATION,
        `unknown prop 'source' value '${_}'`,
      )
    }
  }
}
