<template>
  <nav class="flex items-center bg-primary overflow-hidden" aria-label="Main Navigation." role="presentation">
    <nuxt-link
      class="flex items-center flex-no-shrink text-white mx-6 py-4 disable-underline disable-transition disable-hover"
      to="/"
    >
      <the-logo class="h-8 transition:color hover:text-secondary"></the-logo>
    </nuxt-link>
    <ul class="pl-0 h-full w-full flex-1 flex-grow items-center mb-0">
      <li
        v-for="(link, i) in sections"
        :key="i"
        class="block inline-block"
      >
        <nuxt-link
          :to="link.href"
          :title="link.title"
          class="my-0 text-sm text-white hover:text-white mr-4"
        >
          {{ link.name }}
        </nuxt-link>
      </li>
      <li
        class="inline-block"
      >
        <external-link
          href="https://paulmelero.netlify.com"
          class="my-0 text-sm text-white hover:text-white mr-4"
        ><abbr title="Curriculum Vitae">CV</abbr></external-link>
      </li>
    </ul>
    <div class="hidden sm:flex">
      <social-networks class="sm:flex"></social-networks>
    </div>
  </nav>
</template>

<script>
const SocialNetworks = () => import('~/components/main-presentation/images/social-networks')
const TheLogo = () => import('~/components/main-presentation/images/logo.vue')
const ExternalLink = () => import('~/components/main-presentation/base-texts/external-link')

export default {
  data() {
    return {
      sections: [
        {
          href: '/',
          name: 'Home',
          title: 'Home'
        },
        {
          href: '/blog',
          name: 'Blog',
          title: 'Blog'
        },
      ]
    }
  },
  components: {
    SocialNetworks,
    TheLogo,
    ExternalLink
  }
}
</script>

<style scoped>
abbr[title] {
  text-decoration: none;
}
</style>
