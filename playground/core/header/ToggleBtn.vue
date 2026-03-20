<script setup lang="ts">
const props = defineProps<{
  value: boolean
}>()

const emit = defineEmits(['input'])

const handleClick = () => {
  emit('input', !props.value)
}
</script>

<template>
  <div
    class="playground-toggle-btn"
    :class="{ active: props.value }"
    @click="handleClick"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.playground-toggle-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-inline: 12px;
  height: 30px;
  gap: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 150ms;
  color: var(--pg-text-secondary);
  font-weight: 500;
  font-size: 12px;
  border: 1px solid var(--pg-border);
  outline: none;
  background: var(--pg-input-bg);
  user-select: none;

  &.active {
    background-color: var(--pg-accent);
    border-color: var(--pg-accent);
    color: #fff;
  }

  &:not(.active):hover {
    border-color: var(--pg-text-muted);
    color: var(--pg-text-primary);
  }
}
</style>
