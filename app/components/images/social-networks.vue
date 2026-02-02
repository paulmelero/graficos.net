<template>
  <!-- accepts display classes -->
  <ul class="flex my-0 pl-0 list-none">
    <li v-for="(network, i) in socialNetworks" :key="i" class="flex group">
      <base-texts-external-link
        @click="$emit('click')"
        :href="network.link"
        :title="network.name"
        class="no-underline flex items-center"
      >
        <component
          :is="network.iconFile"
          :font-controlled="false"
          :filled="!shouldDisplayNames"
          width="24"
          height="24"
          class="w-6 mr-2 [&:not(:group-first)]:mx-2 transition-[fill] fill-black hover:fill-accent dark:fill-fwhite dark:hover:fill-actionDark"
        />
        <span v-if="shouldDisplayNames">{{ network.name }}</span>
      </base-texts-external-link>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { h } from 'vue'

import IconGithub from '~/assets/images/logos/github.svg'
import IconLinkedin from '~/assets/images/logos/linkedin.svg'
import IconBsky from '~/assets/images/logos/bluesky.svg'

import GIcon from '../GIcon.vue'
import { tw } from '~/core/tw'

withDefaults(
  defineProps<{
    shouldDisplayNames?: boolean
  }>(),
  {
    shouldDisplayNames: false,
  }
)

const publicConfig = useRuntimeConfig().public
const socialNetworks = computed(() => {
  return [
    {
      name: 'Bluesky',
      link: publicConfig.socialLinks.bsky.link,
      iconFile: IconBsky,
    },
    {
      name: 'GitHub',
      link: publicConfig.socialLinks.github.link,
      iconFile: IconGithub,
    },
    {
      name: 'LinkedIn',
      link: publicConfig.socialLinks.linkedin.link,
      iconFile: IconLinkedin,
    },
    {
      name: 'Go to Atom feed URL',
      link: '/feed',
      iconFile: () =>
        h(GIcon, {
          name: 'material-symbols-light:rss-feed-rounded',
          width: '24',
          height: '24',
          class: tw`text-black hover:text-accent dark:text-fwhite dark:hover:text-actionDark !transition-[color]`,
        }),
    },
  ]
})
</script>
