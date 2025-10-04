<script setup lang="ts">
import { computed } from 'vue'
import { useLoadingContext } from '@/context'

const props = defineProps({
  checked: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['click'])

const loadingContext = useLoadingContext()

const cellClassObject = computed(() => ({
  'dt182-cell--loading': loadingContext.loading.value,
}))

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <td
    class="dt182-cell dt182-cell-selection"
    :class="cellClassObject"
  >
    <div class="dt182-cell-selection-inner">
      <div
        class="dt182-cell-inner dt182-selection-checkbox"
        :class="{ checked: props.checked }"
        @click.stop="handleClick"
      >
        <span v-if="props.checked">&#10004;</span>
      </div>
    </div>
    <div class="dt182-cell-loader"></div>
  </td>
</template>
