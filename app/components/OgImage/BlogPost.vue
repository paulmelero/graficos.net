<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    date?: string
    readingTime?: string
    image?: string
  }>(),
  {
    title: 'Blog post',
    date: '',
    readingTime: '',
    image: '/cover.png',
  }
)
</script>

<template>
  <div
    class="h-full w-full bg-black bg-center bg-cover text-white"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '80px 120px',
      backgroundImage: `url(${image})`,
    }"
  >
    <h1 class="mb-8 text-[64px] leading-tight" :style="{ fontFamily: 'Montserrat', fontWeight: 900 }">
      {{ title }}
    </h1>
    <p class="text-[30px]" :style="{ fontFamily: 'IBM Plex Sans', fontWeight: 400 }">
      <span v-if="date">{{ date }}</span>
      <span v-if="date && readingTime"> · </span>
      <span v-if="readingTime">{{ readingTime }}</span>
    </p>
  </div>
</template>
