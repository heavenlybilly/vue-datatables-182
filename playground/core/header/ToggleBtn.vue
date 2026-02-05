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
  padding-inline: 14px;
  height: 27px;
  gap: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 200ms ease-in-out;
  color: #3e3e3e;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid transparent;
  outline: none;
  background-color: #c1c1c1;

  &.active {
    background-color: #3e3e3e;
    color: #c1c1c1;
  }

  &:hover {
    border-color: #7e7e7e;
  }
}
</style>
