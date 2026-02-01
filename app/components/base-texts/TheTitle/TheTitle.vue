<template>
  <div class="dashed-box bg-[oklab(from_var(--border-color)_l_a_b_/_.5)]">
    <header class="text-primaryDark dark:text-gray-lightest">
      <div class="mb-2 font-title">
        <slot />
      </div>
      <BaseTextsTheTitle-components-dashed-pattern v-if="hasSubtitle" class="h-[1em] py-2" />
      <slot name="subtitle" />
    </header>
    <BaseTextsTheTitle-components-dashed-pattern class="h-[1.5em] mt-2" />
  </div>
</template>

<script lang="ts" setup>
const slots = useSlots()
const hasSubtitle = computed(() => !!slots.subtitle)
</script>
