// eslint-disable-next-line import/no-extraneous-dependencies
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useStore } from '~/store'
import { toolbarControls } from '~/toolbar-controls'

export const useTableProps = () => {
  const store = useStore()
  const { tableParams } = storeToRefs(store)

  const tableProps = computed(() => {
    return toolbarControls.reduce((carry: Record<string, unknown>, group) => {
      const groupCarry = group.controls.reduce((c: Record<string, unknown>, control) => {
        return {
          ...c,
          [control.name]: control?.params?.normalizer
            ? // @ts-ignore
              control.params.normalizer(tableParams.value[control.name])
            : tableParams.value[control.name],
        }
      }, {})

      return { ...carry, ...groupCarry }
    }, {})
  })

  return {
    tableProps,
  }
}
