<script setup lang="ts">
import { computed } from 'vue'
import chevronDoubleLeftIcon from '@/assets/chevron-double-left.svg'
import chevronDoubleRightIcon from '@/assets/chevron-double-right.svg'
import chevronLeftIcon from '@/assets/chevron-left.svg'
import chevronRightIcon from '@/assets/chevron-right.svg'

const props = defineProps({
  page: {
    type: Number,
    required: true,
  },
  filtered: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['input'])

const countPages = computed(() => {
  return Math.ceil(props.filtered / props.rowsPerPage)
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

const handleClickPage = (value: number) => {
  emit('input', value)
}

const handleGoPrev = () => {
  if (canGoPrev.value) {
    emit('input', props.page - 1)
  }
}

const handleGoFirst = () => {
  if (canGoPrev.value) {
    emit('input', 1)
  }
}

const handleGoNext = () => {
  if (canGoNext.value) {
    emit('input', props.page + 1)
  }
}

const handleGoLast = () => {
  if (canGoNext.value) {
    emit('input', countPages.value)
  }
}
</script>

<template>
  <div class="dt-pagination">
    <div
      class="dt-pagination-page dt-pagination-page-arrow"
      :class="{ disabled: !canGoPrev }"
      @click="handleGoFirst"
    >
      <div v-html="chevronDoubleLeftIcon"></div>
    </div>
    <div
      class="dt-pagination-page dt-pagination-page-arrow"
      :class="{ disabled: !canGoPrev }"
      @click="handleGoPrev"
    >
      <div v-html="chevronLeftIcon"></div>
    </div>
    <div
      v-for="(item, index) of pages"
      :key="index"
      class="dt-pagination-page"
      :class="{ active: item === props.page }"
      @click="handleClickPage(item)"
    >
      {{ item }}
    </div>
    <div
      class="dt-pagination-page dt-pagination-page-arrow"
      :class="{ disabled: !canGoNext }"
      @click="handleGoNext"
    >
      <div v-html="chevronRightIcon"></div>
    </div>
    <div
      class="dt-pagination-page dt-pagination-page-arrow"
      :class="{ disabled: !canGoNext }"
      @click="handleGoLast"
    >
      <div v-html="chevronDoubleRightIcon"></div>
    </div>
  </div>
</template>
