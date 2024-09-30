<template>
  <Icon
    :icon="name"
    :width="size"
    :height="size"
    :ssr="true"
  />
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  name: string;
  size?: number;
}>()
</script>
