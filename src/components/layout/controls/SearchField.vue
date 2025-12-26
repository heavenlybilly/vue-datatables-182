<script setup lang="ts">
import { Ref, computed, ref } from 'vue'
import crossIcon from '@/assets/cross.svg'
import searchIcon from '@/assets/search.svg'

const props = defineProps<{
  value: string
}>()

const emit = defineEmits<{
  (e: 'update:value', payload: string): void
}>()

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
    emit('update:value', event.target.value ?? '')
  }
}

const handleClearSearch = () => {
  emit('update:value', '')
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

<style lang="scss">
@use '../vars';
@use '../mixins';

.dt182-search-icon {
  @include mixins.flex-center;

  position: absolute;
  top: 0;
  left: 0;
  width: vars.$dt182-search-width-search-icon;
  height: 100%;
  color: vars.$dt182-search-search-icon-color;

  svg {
    width: 1rem !important;
    height: 1rem !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

.dt182-search-label {
  @include mixins.flex-center;

  position: absolute;
  top: 0;
  left: vars.$dt182-search-width-search-icon;
  height: 100%;
  color: vars.$dt182-search-placeholder-color;
  font-size: vars.$dt182-search-font-size;
  line-height: 1;
  opacity: 1;
  transition: all vars.$dt182-search-transition-duration
    vars.$dt182-search-transition-timing-function;
}

.dt182-search-input {
  position: absolute;
  top: 0;
  left: vars.$dt182-search-width-search-icon;

  $w-min: vars.$dt182-search-width-min;
  $w-search-icon: vars.$dt182-search-width-search-icon;

  width: calc($w-min - $w-search-icon);
  height: 100%;
  padding: 0;
  font-size: vars.$dt182-search-font-size;
  line-height: 1;
  background-color: transparent;
  border: none;
  outline: none;
  opacity: 0;
  transition: all vars.$dt182-search-transition-duration
    vars.$dt182-search-transition-timing-function;

  &::placeholder {
    color: vars.$dt182-search-hovered-placeholder-color;
    font-size: vars.$dt182-search-font-size;
  }
}

.dt182-cross-icon {
  @include mixins.flex-center;

  position: absolute;
  top: 0;
  right: 0;
  width: vars.$dt182-search-width-cross-icon;
  height: 100%;
  color: vars.$dt182-search-cross-icon-color;
  cursor: pointer;

  svg {
    width: 0.5rem !important;
    height: 0.5rem !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}

// root
.dt182-search {
  position: relative;
  width: vars.$dt182-search-width-min;
  height: vars.$dt182-search-height;
  overflow: hidden;
  background-color: vars.$dt182-search-bg-color;
  border: 1px solid vars.$dt182-search-border-color;
  border-radius: 5px;
  cursor: text;
  transition: width vars.$dt182-search-transition-duration
    vars.$dt182-search-transition-timing-function;

  &.dt182-search-active,
  &:hover {
    width: vars.$dt182-search-width-max;

    .dt182-search-input {
      $w-max: vars.$dt182-search-width-max;
      $w-search-icon: vars.$dt182-search-width-search-icon;
      $w-cross-con: vars.$dt182-search-width-cross-icon;

      width: calc($w-max - $w-search-icon - $w-cross-con);
      opacity: 1;
    }

    .dt182-search-label {
      opacity: 0;
    }

    .dt182-search-icon {
      border-color: transparent;
    }
  }
}
</style>
