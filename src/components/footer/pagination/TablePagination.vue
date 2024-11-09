<script setup lang="ts">
import { computed } from 'vue'

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

const emits = defineEmits(['input'])

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
  emits('input', value)
}

const handleGoPrev = () => {
  if (canGoPrev.value) {
    emits('input', props.page - 1)
  }
}

const handleGoFirst = () => {
  if (canGoPrev.value) {
    emits('input', 1)
  }
}

const handleGoNext = () => {
  if (canGoNext.value) {
    emits('input', props.page + 1)
  }
}

const handleGoLast = () => {
  if (canGoNext.value) {
    emits('input', countPages.value)
  }
}
</script>

<template>
  <div class="data-table-pagination">
    <div
      class="data-table-pagination-page"
      :class="{ disabled: !canGoPrev }"
      @click="handleGoFirst"
    >
      <i class="mdi mdi-chevron-double-left"></i>
    </div>
    <div
      class="data-table-pagination-page"
      :class="{ disabled: !canGoPrev }"
      @click="handleGoPrev"
    >
      <i class="mdi mdi-chevron-left"></i>
    </div>
    <div
      v-for="(item, index) of pages"
      :key="index"
      class="data-table-pagination-page"
      :class="{ active: item === props.page }"
      @click="handleClickPage(item)"
    >
      {{ item }}
    </div>
    <div
      class="data-table-pagination-page"
      :class="{ disabled: !canGoNext }"
      @click="handleGoNext"
    >
      <i class="mdi mdi-chevron-right"></i>
    </div>
    <div
      class="data-table-pagination-page"
      :class="{ disabled: !canGoNext }"
      @click="handleGoLast"
    >
      <i class="mdi mdi-chevron-double-right"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-pagination {
  display: flex;
  align-items: center;

  & > *:not(:first-child) {
    margin-left: 0.25rem;
  }
}

.data-table-pagination-page {
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: #ededf1;
  }

  &.active {
    background-color: #ededf1;
  }

  &.disabled {
    background-color: #fff !important;
    color: #c6c6c6 !important;
    cursor: default;
  }
}
</style>
