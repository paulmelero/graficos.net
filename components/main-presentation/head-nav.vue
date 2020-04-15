<template>
  <nav class="flex items-center bg-primary overflow-hidden" aria-label="Main Navigation." role="presentation">
    <nuxt-link
      class="flex items-center text-black flex-no-shrink mx-6 py-4 disable-underline disable-transition disable-hover"
      to="/"
    >
      <the-logo class="h-8 transition:color hover:text-action disable-hover"></the-logo>
    </nuxt-link>
    <ul class="pl-0 h-full w-full flex-1 flex-grow items-center my-0 flex sm:justify-start justify-end">
      <li v-for="(link, i) in sections" :key="i" class="block inline-block">
        <nuxt-link
          :to="link.href"
          :title="link.title"
          class="my-0 text-sm text-black hover:text-action disable-hover mr-4"
          >{{ link.name }}</nuxt-link
        >
      </li>
    </ul>
    <div class="hidden sm:flex mr-2">
      <social-networks class="sm:flex"></social-networks>
    </div>
  </nav>
</template>

<script>
const SocialNetworks = () => import('~/components/images/social-networks')
const TheLogo = () => import('~/components/images/logo')
const ExternalLink = () => import('~/components/base-texts/external-link')

export default {
  data() {
    return {
      sections: [
        {
          href: '/blog',
          name: 'Blog',
          title: 'Blog',
        },
        {
          href: '/contact',
          name: 'Contact',
          title: 'Contact',
        },
      ],
    }
  },
  components: {
    SocialNetworks,
    TheLogo,
    ExternalLink,
  },
}
</script>

<style scoped>
abbr[title] {
  text-decoration: none;
}
</style>
