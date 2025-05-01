<script setup lang="ts">
import VCheckbox from './VCheckbox.vue'
import VInput from './VInput.vue'
import VSelect from './VSelect.vue'
import VTextarea from './VTextarea.vue'

const props = defineProps<{
  title: string
  advanced: boolean
  value: {
    title: string
    display: boolean
    searchable: boolean
    orderable: boolean
    width: string | null
    textAlign: 'center' | 'left' | 'right' | null
    cellSlot: string | null
  }
}>()

const emit = defineEmits(['input'])

const handleInput = (prop: string, value: string | number | null) => {
  emit('input', {
    ...props.value,
    [prop]: value,
  })
}
</script>

<template>
  <div class="playground-column-control">
    <div class="playground-column-control-title">{{ props.title }}</div>

    <div class="playground-column-control-elements">
      <v-checkbox
        label="display"
        :value="props.value.display"
        @input="(v) => handleInput('display', v)"
      ></v-checkbox>

      <v-checkbox
        v-if="advanced"
        label="searchable"
        :value="props.value.searchable"
        @input="(v) => handleInput('searchable', v)"
      ></v-checkbox>

      <v-checkbox
        v-if="advanced"
        label="orderable"
        :value="props.value.orderable"
        @input="(v) => handleInput('orderable', v)"
      ></v-checkbox>

      <v-input
        v-if="advanced"
        label="title"
        :value="props.value.title"
        @input="(v) => handleInput('title', v)"
      ></v-input>

      <v-input
        v-if="advanced"
        label="width"
        :value="props.value.width"
        @input="(v) => handleInput('width', v)"
      ></v-input>

      <v-select
        v-if="advanced"
        label="text-align"
        :value="props.value.textAlign"
        :options="['center', 'left', 'right']"
        @input="(v) => handleInput('textAlign', v)"
      ></v-select>

      <v-textarea
        v-if="advanced"
        label="cell-slot"
        :value="props.value.cellSlot"
        @input="(v) => handleInput('cellSlot', v)"
      ></v-textarea>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-column-control {
  padding: 15px;
  border-radius: 4px;
  border: 1px solid #dedef4;

  &-title {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    color: #4848ca;
    margin-bottom: 16px;
  }

  &-elements {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
