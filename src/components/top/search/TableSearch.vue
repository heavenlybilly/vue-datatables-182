<script setup lang="ts">
import { PropType, Ref, computed, ref } from 'vue'
// @ts-ignore
import crossIcon from '@/assets/cross.svg'
// @ts-ignore
import searchIcon from '@/assets/search.svg'

const props = defineProps({
  value: {
    type: String as PropType<string>,
    required: true,
  },
})

const emits = defineEmits(['input'])

const inputElement: Ref<HTMLInputElement | null> = ref(null)
const hasFocus: Ref<boolean> = ref(false)

const searchWrapperClass = computed(() => ({
  active: !!props.value || hasFocus.value,
}))

const displayCross = computed(() => {
  return !!props.value
})

const handleInput = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emits('input', event.target.value ?? '')
  }
}

const handleClearSearch = () => {
  emits('input', '')
}

const handleWrapperClick = () => {
  if (inputElement.value) {
    inputElement.value.focus()
  }
}

const handleFocus = (value: boolean) => {
  hasFocus.value = value
}
</script>

<template>
  <div
    class="data-table-search-wrapper"
    :class="searchWrapperClass"
    @click="handleWrapperClick"
  >
    <input
      ref="inputElement"
      class="search-input"
      placeholder="Введите для поиска"
      type="text"
      :value="value"
      @blur="handleFocus(false)"
      @focus="handleFocus(true)"
      @input="handleInput"
    />
    <div class="search-icon">
      <img
        alt=""
        :src="searchIcon"
      />
    </div>
    <div class="search-label">Поиск</div>
    <div
      v-if="displayCross"
      class="cross-icon"
      @click="handleClearSearch"
    >
      <img
        alt="23"
        :src="crossIcon"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table-search-wrapper {
  position: relative;
  width: 96px;
  height: 36px;
  transition: width 0.4s ease;
  overflow: hidden;
  border: 1px solid #ededf1;
  border-radius: 5px;
  cursor: text;

  &.active,
  &:hover {
    width: 230px;

    .search-input {
      opacity: 1;
    }

    .search-label {
      opacity: 0;
    }

    .search-icon {
      border-color: transparent;
    }
  }
}

.search-icon {
  position: absolute;
  margin-top: -1px;
  left: 0;
  top: 0;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-label {
  position: absolute;
  top: 0;
  left: 40px;
  font-size: 13px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  color: #c8c8cf;
  opacity: 1;
  transition: opacity 0.4s ease;
}

.search-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0 30px 0 40px;
  font-size: 13px;
  border: none;
  outline: none;
  opacity: 0;
  transition: opacity 0.4s ease;
  line-height: 1;

  &::placeholder {
    font-size: 13px;
    color: #c8c8cf;
  }
}

.cross-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 2px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 8px;
    height: 8px;
  }
}
</style>
