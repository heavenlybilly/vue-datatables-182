<script setup lang="ts">
const emit = defineEmits(['click'])

const handleExpandClick = () => {
  emit('click')
}
</script>

<template>
  <div
    class="playground-re-render-btn"
    @click="handleExpandClick"
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
    re-render
  </div>
</template>

<style scoped lang="scss">
.playground-re-render-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-inline: 12px;
  height: 30px;
  gap: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 150ms;
  color: var(--pg-accent);
  font-weight: 500;
  font-size: 12px;
  border: 1px solid transparent;
  outline: none;
  background-color: var(--pg-accent-bg);

  &:hover {
    background-color: var(--pg-accent);
    color: #fff;
  }
}
</style>
