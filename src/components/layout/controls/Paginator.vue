<script setup lang="ts">
import { computed } from 'vue'
import chevronDoubleLeftIcon from '@/assets/chevron-double-left.svg'
import chevronDoubleRightIcon from '@/assets/chevron-double-right.svg'
import chevronLeftIcon from '@/assets/chevron-left.svg'
import chevronRightIcon from '@/assets/chevron-right.svg'

const props = defineProps<{
  page: number
  itemsCount: number
  rowsPerPage: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

const countPages = computed(() => {
  return Math.ceil(props.itemsCount / props.rowsPerPage)
})

const pages = computed(() => {
  const totalPages = countPages.value
  const currentPage = props.page
  const maxPages = 5

  if (totalPages <= maxPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
  let endPage = startPage + maxPages - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = endPage - maxPages + 1
  }

  return Array.from({ length: maxPages }, (_, i) => startPage + i)
})

const canGoPrev = computed(() => {
  return props.page > 1
})

const canGoNext = computed(() => {
  return props.page < countPages.value
})

const onClickPage = (value: number) => {
  emit('update:page', value)
}

const onGoPrev = () => {
  if (canGoPrev.value) {
    emit('update:page', props.page - 1)
  }
}

const onGoFirst = () => {
  if (canGoPrev.value) {
    emit('update:page', 1)
  }
}

const onGoNext = () => {
  if (canGoNext.value) {
    emit('update:page', props.page + 1)
  }
}

const onGoLast = () => {
  if (canGoNext.value) {
    emit('update:page', countPages.value)
  }
}
</script>

<template>
  <div class="dt182-paginator">
    <div
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :class="{ disabled: !canGoPrev }"
      @click="onGoFirst"
    >
      <div v-html="chevronDoubleLeftIcon"></div>
    </div>
    <div
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :class="{ disabled: !canGoPrev }"
      @click="onGoPrev"
    >
      <div v-html="chevronLeftIcon"></div>
    </div>
    <div
      v-for="(item, index) of pages"
      :key="index"
      class="dt182-paginator-page"
      :class="{ active: item === props.page }"
      @click="onClickPage(item)"
    >
      {{ item }}
    </div>
    <div
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :class="{ disabled: !canGoNext }"
      @click="onGoNext"
    >
      <div v-html="chevronRightIcon"></div>
    </div>
    <div
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :class="{ disabled: !canGoNext }"
      @click="onGoLast"
    >
      <div v-html="chevronDoubleRightIcon"></div>
    </div>
  </div>
</template>

<style lang="scss">
@use '../vars';

.dt182-paginator {
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.25rem;
  }
}

.dt182-paginator-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 0.84rem;
  background-color: vars.$dt182-paginator-btn-bg-color;
  border-radius: 100%;
  cursor: pointer;
  transition: all vars.$transition-duration ease-in-out;
  user-select: none;

  &:hover {
    background-color: vars.$dt182-paginator-hover-btn-bg-color;
  }

  &.active {
    background-color: vars.$dt182-paginator-active-btn-bg-color;
  }

  &.disabled {
    color: vars.$dt182-paginator-disabled-btn-color !important;
    background-color: vars.$dt182-paginator-disabled-btn-bg-color !important;
    cursor: default;
  }
}

.dt182-paginator-page-arrow > div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 0.5rem;
  height: 0.5rem;
}
</style>
