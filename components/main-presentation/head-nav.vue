<template>
  <nav class="flex items-center bg-primary overflow-hidden" role="navigatioon">
    <nuxt-link
      class="flex items-center flex-no-shrink text-white mx-6 py-4 disable-underline disable-transition disable-hover"
      to="/"
    >
      <the-logo class="h-8 transition:color hover:text-secondary"></the-logo>
    </nuxt-link>
    <div class="h-full w-full flex-1 flex-grow items-center pr-6">
      <nuxt-link
        v-for="(link, i) in sections"
        :key="i"
        :to="link.href"
        :title="link.title"
        class="block inline-block my-0 text-sm text-white hover:text-white mr-4"
      >
        {{ link.name }}
      </nuxt-link>
    </div>
    <social-networks></social-networks>
  </nav>
</template>

<script>
const SocialNetworks = () => import('~/components/main-presentation/images/social-networks')
const TheLogo = () => import('~/components/main-presentation/images/logo.vue')
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
    TheLogo
  }
}
</script>

