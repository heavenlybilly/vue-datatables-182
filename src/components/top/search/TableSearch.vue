<script setup lang="ts">
import { PropType, Ref, computed, ref } from 'vue'
import crossIcon from '@/assets/cross.svg?raw'
import searchIcon from '@/assets/search.svg?raw'

const props = defineProps({
  value: {
    type: String as PropType<string>,
    required: true,
  },
})

const emit = defineEmits(['input'])

const inputElement: Ref<HTMLInputElement | null> = ref(null)
const hasFocus: Ref<boolean> = ref(false)

const searchWrapperClass = computed(() => ({
  active: !!props.value || hasFocus.value,
}))

const displayCross = computed(() => {
  return !!props.value
})

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('input', event.target.value ?? '')
  }
}

const handleClearSearch = () => {
  emit('input', '')
}

const handleWrapperClick = () => {
  if (inputElement.value) {
    inputElement.value.focus()
  }
}

const handleFocus = (value: boolean) => {
  hasFocus.value = value
}
</script>

<template>
  <div
    class="dt-search"
    :class="searchWrapperClass"
    @click="handleWrapperClick"
  >
    <input
      ref="inputElement"
      class="dt-search-input"
      placeholder="Введите для поиска"
      type="text"
      :value="value"
      @blur="handleFocus(false)"
      @focus="handleFocus(true)"
      @input="handleInput"
    />
    <div class="dt-search-icon">
      <div v-html="searchIcon"></div>
    </div>
    <div class="dt-search-label">Поиск</div>
    <div
      v-if="displayCross"
      class="dt-cross-icon"
      @click="handleClearSearch"
    >
      <div v-html="crossIcon"></div>
    </div>
  </div>
</template>
