<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span v-html="mail" />
</template>

<script lang="ts" setup>
const removeOS = (str: string) => str.replace(/os/, '')
const grafic = removeOS('graficos')
const mail = `p&#97;u&#108;&#64;${grafic}&#111;s&#46;&#110;e&#116;`
</script>
