<script setup lang="ts">
import { ref } from 'vue'
import crossIcon from '@/assets/cross.svg'
import searchIcon from '@/assets/search.svg'
import { useMessages } from '../../localization/use-messages'

const messages = useMessages()

defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'update:value', payload: string): void
}>()

const inputElement = ref<HTMLInputElement | null>(null)

const onInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:value', event.target.value)
  }
}

const onClearSearch = () => {
  emit('update:value', '')
  inputElement.value?.focus()
}
</script>

<template>
  <div class="dt182-search">
    <span
      aria-hidden="true"
      class="dt182-search-icon"
      v-html="searchIcon"
    />
    <input
      ref="inputElement"
      :aria-label="messages.search"
      class="dt182-search-input"
      :placeholder="messages.searchPlaceholder"
      type="text"
      :value="value"
      @input="onInput"
    />
    <button
      v-if="value"
      :aria-label="messages.clearSearch"
      class="dt182-cross-icon"
      type="button"
      @click="onClearSearch"
    >
      <span
        aria-hidden="true"
        v-html="crossIcon"
      />
    </button>
  </div>
</template>

<style lang="scss">
@use './search-field';
</style>
