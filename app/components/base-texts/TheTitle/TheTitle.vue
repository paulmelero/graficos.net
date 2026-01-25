<template>
  <div class="dashed-box">
    <header>
      <div class="mb-2 font-title">
        <slot />
      </div>
      <base-texts-the-title-components-dashed-pattern v-if="hasSubtitle" class="h-[1em] my-2" />
      <slot name="subtitle" />
    </header>
    <base-texts-the-title-components-dashed-pattern class="h-[1.5em] mt-2" />
  </div>
</template>

<script lang="ts" setup>
const slots = useSlots()
const hasSubtitle = computed(() => !!slots.subtitle)
</script>
