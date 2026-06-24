<template>
  <base-texts-the-time v-if="date" :date="date" class="font-ibm block sm:inline-block" />
  <span v-if="modifiedDate && !sameDate" class="block sm:inline-block font-ibm text-xs">
    <span><span class="hidden sm:inline-block">&nbsp;</span>(<span class="text-xs">Last modified:</span>&nbsp;</span
    ><base-texts-the-time v-if="modifiedDate" :date="modifiedDate" /><span v-if="modifiedDate">)</span>
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  date?: string
  modifiedDate?: string
}>()

const sameDate = computed(() => {
  return props.date === props.modifiedDate || props.date?.split('T')[0] === props.modifiedDate?.split('T')[0]
})
</script>
