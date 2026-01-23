<template>
  <div class="pointer-events-none absolute isolate inset-0 z-1">
    <!-- top -->
    <div
      class="absolute top-0 left-0 right-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.black/5)] dark:[--pattern-fg:theme(colors.white/1)]"
      :style="{ height: `${thickness}px` }"
    ></div>

    <!-- right -->
    <div
      class="absolute top-0 bottom-0 right-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.black/5)] dark:[--pattern-fg:theme(colors.white/1)]"
      :style="{ width: `${thickness}px` }"
    ></div>

    <!-- bottom -->
    <div
      class="absolute bottom-0 left-0 right-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.black/5)] dark:[--pattern-fg:theme(colors.white/1)]"
      :style="{ height: `${thickness}px` }"
    ></div>

    <!-- left -->
    <div
      class="absolute top-0 bottom-0 left-0 bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed [--pattern-fg:theme(colors.black/5)] dark:[--pattern-fg:theme(colors.white/1)]"
      :style="{ width: `${thickness}px` }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    thickness?: number
  }>(),
  {
    thickness: 12,
  }
)
</script>
