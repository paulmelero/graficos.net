<template>
  <svg class="dashed-box !border-x-0 !border-b-0" width="100%" xmlns="http://www.w3.org/2000/svg">
    <pattern
      id="pattern-checkers"
      x="0"
      y="0"
      width="100%"
      height="1em"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
      fill="var(--border-color)"
    >
      <line class="dashed-line" x1="0" y1="8" x2="100%" y2="8" stroke-dasharray="8 4" />
    </pattern>
    <rect x="0%" y="0" width="100%" height="100%" fill="url(#pattern-checkers)"></rect>
  </svg>
</template>

<style lang="postcss" scoped>
.dashed-line {
  stroke: var(--border-color);
}

@prefers-color-scheme: dark {
  .dashed-line {
    stroke: var(--border-color-dark);
  }
}
</style>
