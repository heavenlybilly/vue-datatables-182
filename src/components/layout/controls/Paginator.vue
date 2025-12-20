<script setup lang="ts">
import { computed } from 'vue'
import chevronDoubleLeftIcon from '@/assets/chevron-double-left.svg'
import chevronDoubleRightIcon from '@/assets/chevron-double-right.svg'
import chevronLeftIcon from '@/assets/chevron-left.svg'
import chevronRightIcon from '@/assets/chevron-right.svg'
import { useMessages } from '../../localization/use-messages'

const messages = useMessages()

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
    return Array.from(
      {
        length: totalPages,
      },
      (_, i) => i + 1,
    )
  }

  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2))
  let endPage = startPage + maxPages - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = endPage - maxPages + 1
  }

  return Array.from(
    {
      length: maxPages,
    },
    (_, i) => startPage + i,
  )
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
  <nav
    :aria-label="messages.pagination"
    class="dt182-paginator"
  >
    <button
      :aria-label="messages.firstPage"
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :disabled="!canGoPrev"
      type="button"
      @click="onGoFirst"
    >
      <div
        aria-hidden="true"
        v-html="chevronDoubleLeftIcon"
      ></div>
    </button>
    <button
      :aria-label="messages.previousPage"
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :disabled="!canGoPrev"
      type="button"
      @click="onGoPrev"
    >
      <div
        aria-hidden="true"
        v-html="chevronLeftIcon"
      ></div>
    </button>
    <button
      v-for="item of pages"
      :key="item"
      :aria-current="item === props.page ? 'page' : undefined"
      :aria-label="messages.page(item)"
      class="dt182-paginator-page"
      :class="{
        active: item === props.page,
      }"
      type="button"
      @click="onClickPage(item)"
    >
      {{ item }}
    </button>
    <button
      :aria-label="messages.nextPage"
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :disabled="!canGoNext"
      type="button"
      @click="onGoNext"
    >
      <div
        aria-hidden="true"
        v-html="chevronRightIcon"
      ></div>
    </button>
    <button
      :aria-label="messages.lastPage"
      class="dt182-paginator-page dt182-paginator-page-arrow"
      :disabled="!canGoNext"
      type="button"
      @click="onGoLast"
    >
      <div
        aria-hidden="true"
        v-html="chevronDoubleRightIcon"
      ></div>
    </button>
  </nav>
</template>

<style lang="scss">
@use './paginator';
</style>
