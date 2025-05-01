<script setup lang="ts">
const props = defineProps<{
  value: 'local' | 'remote'
}>()

const emit = defineEmits(['input'])

const handleSwitchLocal = () => {
  if (props.value !== 'local') {
    emit('input', 'local')
  }
}

const handleSwitchRemote = () => {
  if (props.value !== 'remote') {
    emit('input', 'remote')
  }
}
</script>

<template>
  <div class="playground-source-switcher">
    <span
      :class="{ 'playground-active': props.value === 'local' }"
      @click="handleSwitchLocal"
    >
      Local
    </span>
    <span
      :class="{ 'playground-active': props.value === 'remote' }"
      @click="handleSwitchRemote"
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
  font-size: 14px;
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
