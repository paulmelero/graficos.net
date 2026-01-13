<template>
  <div
    v-if="mentions && mentionsNumber && mentions.mentionsAvatars"
    class="flex gap-2 sm:gap-0 sm:items-center flex-wrap flex-col sm:flex-row"
  >
    <span class="italic">{{ mentionsNumberText }}</span>
    <span v-if="mentions?.mentionsAvatars && mentions.mentionsAvatars.length" class="hidden sm:inline-block sm:mx-2"
      >·</span
    >
    <ul
      v-if="mentions?.mentionsAvatars && mentions.mentionsAvatars.length"
      class="flex gap-0 items-center !mb-0 !pl-0 flex-wrap isolate"
    >
      <li
        v-for="(avatar, index) in mentions?.mentionsAvatars"
        :key="avatar"
        class="list-none isolate"
        :class="{
          'z-1': index === 0,
          '-ml-2': index > 0,
        }"
        :style="{
          zIndex: -(index + 1),
        }"
      >
        <img
          decoding="async"
          :src="avatar"
          alt=""
          class="w-6 h-6 object-cover !rounded-full !mb-0 border-2 border-white"
        />
      </li>
    </ul>
  </div>
  <p v-else></p>
</template>

<script setup lang="ts">
const props = defineProps<{
  lang?: string
}>()

const route = useRoute()

const mentions = useMentions(route.fullPath)
const mentionsNumber = computed(() => mentions.value?.mentionsNumber ?? 0)
const pluralRules = new Intl.PluralRules(props.lang ?? 'en-US').select(mentionsNumber.value)
const mentionsNumberText = computed(() => {
  const options = new Map([
    ['one', 'time'],
    ['other', 'times'],
  ])
  const suffix = options.get(pluralRules) ?? 'times'
  return `This post has been webmentioned ${mentionsNumber.value} ${suffix}`
})
</script>
