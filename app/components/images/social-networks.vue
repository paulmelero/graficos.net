<template>
  <!-- accepts display classes -->
  <ul
    class="flex my-0 pl-0 list-none w-full justify-center"
    :class="{
      'gap-2': !shouldDisplayNames,
    }"
  >
    <template v-for="(network, i) in socialNetworks" :key="i">
      <li v-if="!onlySocials || network.kind === 'social'">
        <base-texts-external-link
          @click="$emit('click')"
          :href="network.link"
          :title="network.name"
          class="no-underline"
        >
          <component
            :is="network.iconFile"
            width="24"
            height="24"
            class="w-6 inline-block align-text-bottom transition-[fill] fill-black hover:fill-accent dark:fill-fwhite dark:hover:fill-actionDark"
            :class="{
              'mr-2': shouldDisplayNames,
            }"
          />
          <span v-if="shouldDisplayNames">{{ network.name }}</span>
        </base-texts-external-link>
      </li>
    </template>
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
    onlySocials?: boolean
  }>(),
  {
    shouldDisplayNames: false,
    onlySocials: false,
  }
)

const publicConfig = useRuntimeConfig().public
const socialNetworks = computed(() => {
  return [
    {
      name: 'Bluesky',
      kind: 'social',
      link: publicConfig.socialLinks.bsky.link,
      iconFile: IconBsky,
    },
    {
      name: 'GitHub',
      kind: 'social',
      link: publicConfig.socialLinks.github.link,
      iconFile: IconGithub,
    },
    {
      name: 'LinkedIn',
      kind: 'social',
      link: publicConfig.socialLinks.linkedin.link,
      iconFile: IconLinkedin,
    },
    {
      name: 'Go to Atom feed URL',
      kind: 'content-syndication',
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
