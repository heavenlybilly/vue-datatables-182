<script setup lang="ts">
import { computed } from 'vue'
import ToolbarControl from '~/core/params/ToolbarControl.vue'
import { ToolbarGroup } from '~/types'

const props = defineProps<{
  tableParams: Record<string, unknown>
  group: ToolbarGroup
}>()

const emit = defineEmits(['input'])

const controlItems = computed(() => {
  return props.group.controls
    .filter((control) => !control.hidden)
    .map((control) => {
      let value = props.tableParams?.[control.name]

      if (value === undefined && control.params?.defaultValue) {
        value = control.params.defaultValue
      }

      return {
        control,
        value,
      }
    })
})

const handleInput = (name: string, value: unknown) => {
  emit('input', { name, value })
}
</script>

<template>
  <div class="playground-toolbar-group">
    <div class="playground-toolbar-group-title">{{ props.group.title }}</div>
    <div class="playground-toolbar-group-controls">
      <div
        v-for="item of controlItems"
        :key="item.control.name"
        class="playground-toolbar-group-control"
      >
        <div
          class="playground-toolbar-group-control-label"
          :class="{ required: item.control.required }"
        >
          {{ item.control.name.replace(/([a-z])([A-Z])/g, '$1 $2') }}
        </div>

        <toolbar-control
          :control="item.control"
          :value="item.value"
          @input="(value) => handleInput(item.control.name, value)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.playground-toolbar-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.playground-toolbar-group-title {
  font-weight: 600;
  font-size: 16px;
  text-transform: uppercase;
  color: #1a1a65;
}

.playground-toolbar-group-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.playground-toolbar-group-control {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.playground-toolbar-group-control-label {
  position: relative;
  font-weight: 600;
  font-size: 9px;
  text-transform: uppercase;
  color: #4848ca;

  &.required {
    &:after {
      position: relative;
      right: 1px;
      content: '*';
      color: #fb1f1f;
      font-size: 13px;
    }
  }
}
</style>
