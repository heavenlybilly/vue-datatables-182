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
    <i class="fa fa-repeat"></i>
    re-render
  </div>
</template>

<style scoped lang="scss">
.playground-re-render-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-inline: 14px;
  height: 32px;
  gap: 8px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 200ms ease-in-out;
  color: #4848ca;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid transparent;
  outline: none;
  background-color: #dedef4;

  &:hover {
    border-color: #4848ca;
  }
}
</style>
