<script setup lang="ts">
import { computed } from 'vue'
import VCheckbox from '~/toolbar/components/VCheckbox.vue'
import VInput from '~/toolbar/components/VInput.vue'
import VSelect from '~/toolbar/components/VSelect.vue'
import VTextarea from '~/toolbar/components/VTextarea.vue'
import { ControlType, ToolbarControl } from '~/types'

const props = defineProps<{
  value: unknown
  control: ToolbarControl
}>()

const emit = defineEmits(['input'])

const component = computed(() => {
  switch (props.control.type) {
    case ControlType.STRING:
      return {
        is: VInput,
        props: props.control.props ?? {},
      }
    case ControlType.NUMBER:
      return {
        is: VInput,
        props: props.control.props ?? {},
      }
    case ControlType.CODE:
      return {
        is: VTextarea,
        props: props.control.props ?? {},
      }
    case ControlType.SWITCHER:
      return {
        is: VCheckbox,
        props: props.control.props ?? {},
      }
    case ControlType.SELECT:
      return {
        is: VSelect,
        props: props.control.props ?? {},
      }
    default: {
      const _: never = props.control.type
      throw new Error('Unsupported toolbar control type')
    }
  }
})

const handleInput = (value: unknown) => {
  emit('input', value)
}
</script>

<template>
  <component
    :is="component.is"
    :value="props.value"
    v-bind="component.props"
    @input="handleInput"
  ></component>
</template>

<style lang="scss"></style>
