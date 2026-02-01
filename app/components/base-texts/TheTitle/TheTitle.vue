<template>
  <div
    class="dashed-box bg-[oklab(from_var(--border-color)_l_a_b_/_.5)] dark:bg-[oklab(from_var(--border-color)_calc(l*.3)_a_b_/_.5)]"
  >
    <header class="text-primaryDark dark:text-gray-lightest font-ibm dark:font-thin">
      <slot />
      <BaseTextsTheTitle-components-dashed-pattern v-if="hasSubtitle" class="h-[1em] py-2" />
      <slot name="subtitle" />
    </header>
    <BaseTextsTheTitle-components-dashed-pattern class="h-[1.5em]" />
  </div>
</template>

<script lang="ts" setup>
const slots = useSlots()
const hasSubtitle = computed(() => !!slots.subtitle)
</script>
