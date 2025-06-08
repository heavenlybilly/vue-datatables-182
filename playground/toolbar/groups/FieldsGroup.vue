<script setup lang="ts">
import { ref } from 'vue'
import { usePersistentState } from '~/composables/usePersistentState'
import { useTableFields } from '~/composables/useTableFields'
import ColumnControl from '~/toolbar/groups/ColumnControl.vue'
import { FieldDef } from '~/types'

const { fields, setField } = useTableFields()

const activeField = ref<string | null>(null)

usePersistentState('playground-active-field', activeField)

const handleFieldNameClick = (name: string): void => {
  if (activeField.value === name) {
    activeField.value = null
    return
  }

  activeField.value = name
}

const handleUpdateField = (name: string, field: FieldDef) => {
  setField(name, field)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px">
    <div style="display: inline-flex; gap: 15px; flex-direction: column">
      <div
        v-for="field of fields"
        :key="field.fieldName"
        class="playground-field-item"
      >
        <div
          :class="{ strike: !field.display }"
          @click="handleFieldNameClick(field.fieldName)"
        >
          {{ field.title }}
        </div>

        <column-control
          v-if="activeField === field.fieldName"
          style="margin-top: 5px"
          :value="field"
          @input="(v) => handleUpdateField(field.fieldName, v)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-field-item {
  display: inline-block;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  color: #989898;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #3a46bf;
  }

  .strike {
    text-decoration: line-through;
  }
}
</style>
