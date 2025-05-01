<script setup lang="ts">
import { PropType, Ref, computed, ref } from 'vue'
import crossIcon from '@/assets/cross.svg'
import searchIcon from '@/assets/search.svg'

const props = defineProps({
  value: {
    type: String as PropType<string>,
    required: true,
  },
})

const emit = defineEmits(['input'])

const inputElement: Ref<HTMLInputElement | null> = ref(null)
const hasFocus: Ref<boolean> = ref(false)

const classObject = computed(() => ({
  'dt182-search-active': !!props.value || hasFocus.value,
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
    class="dt182-search"
    :class="classObject"
    @click="handleWrapperClick"
  >
    <input
      ref="inputElement"
      class="dt182-search-input"
      placeholder="Введите для поиска"
      type="text"
      :value="value"
      @blur="handleFocus(false)"
      @focus="handleFocus(true)"
      @input="handleInput"
    />
    <div
      class="dt182-search-icon"
      v-html="searchIcon"
    />
    <div class="dt182-search-label">Поиск</div>
    <div
      v-if="displayCross"
      class="dt182-cross-icon"
      @click="handleClearSearch"
      v-html="crossIcon"
    />
  </div>
</template>
