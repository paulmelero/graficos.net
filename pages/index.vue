<template>
  <section>
    <the-title class="text-center logo-placeholder">
      <the-logo slot="title" class="text-primary mx-auto logo-height mt-6 block"></the-logo>
    </the-title>
    <section class="container mx-auto sm:mt-8 px-4" aria-label="Main section.">
        <h2 class="text-2xl mb-8">Hi! I'm Paul Melero, Engineer, Web Developer and Visual Artist.</h2>
        <h3 slot="title" class="text-xl mb-6">About Graficos.NET and me ></h3>
      <p class="text-base">
        Awesome! It's been awhile, but here I am, again.
        You may know me as
        <external-link :href="social.twitter.link">@{{social.twitter.name}}</external-link>
        or
        <external-link :href="social.github.link">{{social.github.name}}</external-link>.
        The first version of this site was made by me in
        <external-link
          href="http://web.archive.org/web/20020603194144/http://www.graficos.net:80/"
        >the early 2000's</external-link>.
        Yes, I was and I am a proud self-taught geek.
        I've also studied Agriculture Engineering and a bunch of other things.
      </p>
      <p class="text-base">
        In case you are interested, I have also prepared an online version of
        <external-link
          :href="social.cv.link"
        >my CV 📝</external-link>.
      </p>
      <p class="text-base">
        This is the first time I'm publishing my web on OS.
        Be sure you check
        <external-link href="https://github.com/gangsthub/graficos.net">the source</external-link>.
      </p>
      <p class="text-base">
        The <nuxt-link to="/blog">Blog section</nuxt-link> is powered by Nuxt and Netlify. Actually, I wrote
        <nuxt-link
          to="/blog/2018-08-21-setting-up-nuxt-with-netlify-netlify-cms-and-netlify-identity"
        >a post</nuxt-link>
        about the process.
      </p>
    </section>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/base-texts/the-title')
const ExternalLink = () => import('~/components/base-texts/external-link')
const TheLogo = () => import('~/components/images/logo')
const HOME = 'Home'

export default {
  name: HOME,
  transition: 'page-opacity',
  head: {
    title: HOME,
  },
  computed: {
    social() {
      return process.env.social
    }
  },
  components: {
    TheTitle,
    ExternalLink,
    TheLogo,
  }
}
</script>

<style scoped>
.logo-height,
.logo-placeholder {
  height: 20vw;
  max-height: 200px;
}
</style>
