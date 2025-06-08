<script setup lang="ts">
import { useTableSource } from '~/composables/useTableSource'
import { DTSource } from '@/types/types'

const { source, setSource } = useTableSource()

const handleSwitch = (value: DTSource) => {
  if (source.value !== value) {
    setSource(value)
  }
}
</script>

<template>
  <div class="playground-source-switcher">
    <span
      :class="{ 'playground-active': source === 'local' }"
      @click="handleSwitch('local')"
    >
      Local
    </span>
    <span
      :class="{ 'playground-active': source === 'remote' }"
      @click="handleSwitch('remote')"
    >
      Remote
    </span>
  </div>
</template>

<style scoped lang="scss">
.playground-source-switcher {
  display: inline-flex;
  gap: 5px;
  font-weight: 600;
  font-size: 12px;
  color: #989898;
  text-transform: uppercase;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
  user-select: none;

  span.playground-active {
    color: #3a46bf;
  }
}
</style>
