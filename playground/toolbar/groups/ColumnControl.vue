<script setup lang="ts">
import { FieldDef } from '~/types'
import { DTTextAlign } from '@/types'
import VCheckbox from '../../components/VCheckbox.vue'
import VInput from '../../components/VInput.vue'
import VSelect from '../../components/VSelect.vue'
import VTextarea from '../../components/VTextarea.vue'

const props = defineProps<{
  value: FieldDef
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
    <div class="playground-column-control-elements">
      <v-checkbox
        label="display"
        :value="props.value.display"
        @input="(v) => handleInput('display', v)"
      />

      <v-checkbox
        label="searchable"
        :value="props.value.searchable"
        @input="(v) => handleInput('searchable', v)"
      />

      <v-checkbox
        label="orderable"
        :value="props.value.orderable"
        @input="(v) => handleInput('orderable', v)"
      />

      <v-input
        label="title"
        :value="props.value.title"
        @input="(v) => handleInput('title', v)"
      />

      <v-input
        label="width"
        :value="props.value.width"
        @input="(v) => handleInput('width', v)"
      />

      <v-select
        label="text-align"
        :options="[DTTextAlign.CENTER, DTTextAlign.LEFT, DTTextAlign.RIGHT]"
        :value="props.value.textAlign"
        @input="(v) => handleInput('textAlign', v)"
      />

      <v-textarea
        label="cell-slot"
        :value="props.value.cellSlot"
        @input="(v) => handleInput('cellSlot', v)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-column-control {
  padding-top: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dedef4;

  &-elements {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
