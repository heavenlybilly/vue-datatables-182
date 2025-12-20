import { Source } from '../types'
import debounce from '../utils/debounce'
import type { DataProvider, DataProviderOptions } from './types'
import { useLocalAdapter } from './useLocalAdapter'
import { useRemoteAdapter } from './useRemoteAdapter'

export const useDataProvider = (options: DataProviderOptions): DataProvider => {
  const local = useLocalAdapter(options)
  const remote = useRemoteAdapter(options)
  let disposed = false
  const delayed = debounce(() => {
    remote.apply()
  }, 300)

  const cancel = () => {
    delayed.cancel()
    remote.cancel()
  }

  const apply = (debounced = false) => {
    if (disposed) {
      return
    }

    if (options.getSource() !== Source.REMOTE) {
      cancel()
      local.apply()
    } else if (debounced) {
      remote.cancel()
      delayed()
    } else {
      delayed.cancel()
      remote.apply()
    }
  }

  return {
    apply,
    cancel,
    async reload() {
      if (disposed) {
        return
      }

      cancel()

      if (options.getSource() === Source.REMOTE) {
        await remote.reload()
      } else {
        local.apply()
      }
    },
    dispose() {
      disposed = true
      delayed.cancel()
      remote.dispose()
    },
  }
}
