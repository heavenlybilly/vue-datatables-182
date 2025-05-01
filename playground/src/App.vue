<script setup lang="ts">
import { computed, ref } from 'vue'
import VCheckbox from './components/VCheckbox.vue'
import { usePersistentState } from './views/playground/usePersistentState'

const isHighlight = ref(false)

usePersistentState('playground-app-highlight', { isHighlight })

const classObject = computed(() => ({
  'playground-highlight': isHighlight.value,
}))
</script>

<template>
  <div class="playground-wrapper" :class="classObject">
    <div class="playground-header">
      <div class="playground-header-inner">
        <router-link :to="{ name: 'playground' }" class="playground-link">Playground</router-link>
      </div>
      <div>
        <v-checkbox v-model="isHighlight" label="highlight" />
      </div>
    </div>

    <div class="playground-content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
*, *:before, *:after {
  box-sizing: border-box;
}

html, body {
  height: 100vh;
}

.playground-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 30px;
  background-color: #f6f6f6;

  &.playground-highlight {
    background-color: #fff !important;

    .playground-example-block {
      background-color: #f6f6f6 !important;
    }

    .playground-control-group {
      background-color: #f6f6f6 !important;
    }
  }
}

.playground-header {
  margin-bottom: 35px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;

  &--inner {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 5px;
  }
}

.playground-content {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}

.playground-link {
  color: #2b2b2b;
  font-weight: 600;
  font-size: 13px;
  text-decoration:  none;
  border-radius: 5px;
  text-transform: uppercase;
}

.playground-badge-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.playground-badge {
  padding: 2px 4px;
  font-size: 10px;
  border-radius: 5px;
  line-height: 1;

  &-primary {
    background-color: #dedef4;
    color: #4848ca;
  }

  &-danger {
    background-color: #f4dede;
    color: #ca4848;
  }

  &-success {
    background-color: #e4f4de;
    color: #73ca48;
  }

  &-info {
    background-color: #deebf4;
    color: #4880ca;
  }

  &-warning {
    background-color: #f4efde;
    color: #ca9d48;
  }
}

.btn {
  border-radius: 5px;
  border: 1px solid transparent;
  outline: none;
  padding: 6px 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &-primary {
    background-color: #dedef4;
    color: #4848ca;

    &:hover {
      border-color: #4848ca;
    }
  }
}
</style>