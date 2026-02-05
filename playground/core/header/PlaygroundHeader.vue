<script setup lang="ts">
import ToggleBtn from '~/core/header/ToggleBtn.vue'
import { useHeader } from '~/core/header/useHeader'

const {
  headerBgColor,
  bodyBgColor,
  tableBgColor,
  showTableParams,
  setHeaderBgColor,
  setTableBgColor,
  setBodyBgColor,
  setShowTableParams,
} = useHeader()

const handleHeaderBgColorInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    setHeaderBgColor(e.target.value)
  }
}

const handleTableBgColorInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    setTableBgColor(e.target.value)
  }
}

const handleBodyBgColorInput = (e: Event) => {
  if (e.target instanceof HTMLInputElement) {
    setBodyBgColor(e.target.value)
  }
}
</script>

<template>
  <div class="playground-header">
    <div class="playground-header-colors">
      <div>
        <input
          id="toolbar-bg-color"
          type="color"
          :value="headerBgColor"
          @input="handleHeaderBgColorInput"
        />
      </div>

      <div>
        <input
          id="toolbar-bg-color"
          type="color"
          :value="bodyBgColor"
          @input="handleBodyBgColorInput"
        />
      </div>

      <div>
        <input
          id="toolbar-bg-color"
          type="color"
          :value="tableBgColor"
          @input="handleTableBgColorInput"
        />
      </div>
    </div>

    <div>
      <toggle-btn
        :value="showTableParams"
        @input="(v) => setShowTableParams(v)"
      >
        params
      </toggle-btn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-header {
  padding: 5px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.playground-header-colors {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
</style>
