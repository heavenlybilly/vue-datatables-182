import { computed, inject, provide } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'
import type { TableMessages } from '../../types/messages'
import { usePluginConfiguration } from '../plugin/configuration'
import { defaultMessages } from './default-messages'

const messagesKey: InjectionKey<ComputedRef<Readonly<TableMessages>>> = Symbol('Table messages')

export function provideMessages(local: () => Partial<TableMessages> | undefined) {
  const configuration = usePluginConfiguration()

  provide(
    messagesKey,
    computed(() => {
      const messages = {
        ...defaultMessages,
      }
      ;[configuration.messages, local()].forEach((override) => {
        const entries = Object.entries(override ?? {}).filter(([, value]) => value !== undefined)

        Object.assign(messages, Object.fromEntries(entries))
      })

      return messages
    }),
  )
}

export function useMessages() {
  return inject(
    messagesKey,
    computed(() => defaultMessages),
  )
}
