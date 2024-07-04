<template>
  <div>
    <!-- accepts display classes -->
    <ul class="flex my-0 pl-0">
      <li v-for="(network, i) in socialNetworks" :key="i" class="flex">
        <base-texts-external-link :href="network.link" class="disable-underline grid items-center">
          <component
            :is="network.iconFile"
            :font-controlled="false"
            :filled="true"
            width="24"
            height="24"
            class="w-6 mx-2 transition:fill"
            :class="iconsClassNames"
          />
        </base-texts-external-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { tw } from '~/core/tw'
import IconTwitter from '~/assets/images/logos/twitter.svg'
import IconGithub from '~/assets/images/logos/github.svg'
import IconLinkedin from '~/assets/images/logos/linkedin.svg'

withDefaults(
  defineProps<{
    iconsClassNames?: string
  }>(),
  {
    iconsClassNames: tw`fill-black hover:fill-action dark:fill-fwhite dark:hover:fill-actionDark`,
  }
)

const publicConfig = useRuntimeConfig().public
const socialNetworks = computed(() => {
  return [
    {
      name: 'Twitter',
      link: publicConfig.socialLinks.twitter.link,
      iconFile: IconTwitter,
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
  ]
})
</script>
