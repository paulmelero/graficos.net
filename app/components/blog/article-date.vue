<template>
  <base-texts-the-time v-if="date" :date="date" class="font-ibm block sm:inline-block" />
  <span class="block sm:inline-block font-ibm text-xs">
    <span v-if="modifiedDate"
      ><span class="hidden sm:inline-block">&nbsp;</span>(<span class="text-xs">Last modified:</span>&nbsp;</span
    ><base-texts-the-time v-if="modifiedDate" :date="modifiedDate" /><span v-if="modifiedDate">)</span>
  </span>
</template>

<script lang="ts" setup>
defineProps<{
  date?: string
  modifiedDate?: string
}>()
</script>
