<template>
  <div class="dt182-top">
    <div class="dt182-top-left">
      <slot name="topLeftBeforeActions" />
      <slot name="topSearch"></slot>
      <slot name="topLeftAfterActions" />
    </div>
    <div class="dt182-top-right">
      <slot name="topRight" />
    </div>
  </div>
</template>

<style lang="scss">
.dt182-top {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: var(--dt182-panel-gap, 0.75rem);
  align-items: center;
  justify-content: space-between;
  min-width: 0;
}

.dt182-top-left,
.dt182-top-right {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  min-width: 0;
  max-width: 100%;
}

.dt182-top-right {
  margin-left: auto;
}
</style>
