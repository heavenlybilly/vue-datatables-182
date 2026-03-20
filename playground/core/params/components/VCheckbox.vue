<script setup lang="ts">
const props = defineProps<{
  value?: boolean
  label?: string
}>()

const emit = defineEmits(['input'])

const handleClick = () => {
  emit('input', !props.value)
}
</script>

<template>
  <label
    class="playground-switch"
    @click.prevent="handleClick"
  >
    <div
      class="playground-switch-track"
      :class="{ active: props.value }"
    >
      <div class="playground-switch-thumb"></div>
    </div>
    <span
      v-if="props.label"
      class="playground-switch-label"
      >{{ props.label }}</span
    >
  </label>
</template>

<style scoped lang="scss">
.playground-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.playground-switch-track {
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 9px;
  background: var(--pg-switch-bg);
  transition:
    background 200ms,
    box-shadow 200ms;
  flex-shrink: 0;

  &.active {
    background: var(--pg-switch-bg-active);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);

    .playground-switch-thumb {
      transform: translateX(16px);
    }
  }
}

.playground-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.playground-switch-label {
  font-size: 12px;
  color: var(--pg-text-secondary);
  font-weight: 500;
  line-height: 1;
}
</style>
