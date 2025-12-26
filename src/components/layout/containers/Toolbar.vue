<template>
  <div class="dt182-top">
    <div class="dt182-top-left">
      <slot name="topLeftBeforeActions" />
      <slot name="topSearch"></slot>
      <slot name="topLeftAfterActions" />
    </div>
    <div>
      <slot name="topRight" />
    </div>
  </div>
</template>

<style lang="scss">
.dt182-top {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
}

.dt182-top-left {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
