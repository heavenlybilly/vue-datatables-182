import { Source } from '../types'
import debounce from '../utils/debounce'
import { DataProvider, DataProviderOptions } from './types'
import { useLocalAdapter } from './useLocalAdapter'
import { useRemoteAdapter } from './useRemoteAdapter'

const DEBOUNCE_MS = 300

export const useDataAdapter = (options: DataProviderOptions) => {
  const {
    columnRegistry,
    core,
    getLocalItems,
    getUrl,
    getFilter,
    getRequestAdapter,
    getResponseAdapter,
    getCsrfToken,
    emit,
  } = options

  const local = useLocalAdapter({
    core,
    columnRegistry,
    getLocalItems,
  })
  const remote = useRemoteAdapter({
    core,
    columnRegistry,
    getUrl,
    getFilter,
    getRequestAdapter,
    getResponseAdapter,
    getCsrfToken,
    emit,
  })

  const remoteApplyDebounced = debounce(() => {
    remote.apply()
  }, DEBOUNCE_MS)

  const apply = () => {
    if (options.getSource() === Source.REMOTE) {
      return remoteApplyDebounced()
    }
    return local.apply()
  }

  const reload = async () => {
    if (options.getSource() === Source.REMOTE) {
      remoteApplyDebounced.cancel?.()
      return remote.reload()
    }
    return local.apply()
  }

  const dataProvider: DataProvider = {
    apply,
    reload,
  }

  return dataProvider
}
