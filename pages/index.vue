<template>
  <section>
    <the-title>
      <h1 slot="title" class="text-3xl">{{ title }}</h1>
    </the-title>
    <section class="container mx-auto px-4">
        <h2 class="text-2xl mb-8">Hi! I'm Paul Melero, Engineer, Frontend Dev. and Visual Artist.</h2>
        <h3 slot="title" class="text-xl mb-6">About Graficos.NET and me ></h3>
      <p class="text-base">
        Awesome! It's been awhile, but here I am, again.
        You may know me as Paul or
        <external-link href="https://twitter.com/paul_melero">@paul_melero</external-link>
        or
        <external-link href="https://github.com/gangsthub">Gangsthub</external-link>.
        The first version of this site was made by me in the early 00's.
        Yes, I was and I am a proud self-taught geek.
        I've also studied Agriculture Engineering and a bunch of other things.
      </p>
      <p class="text-base">
        This is the first time I'm publishing my web on OS.
        Be sure you check the source. The Blog is powered by Nuxt and Netlify.
        I wrote a post about it.
      </p>
    </section>
  </section>
</template>

<script>
const TheTitle = () => import('~/components/main-presentation/base-texts/the-title')
const ExternalLink = () => import('~/components/main-presentation/base-texts/external-link')
const HOME = 'Home'

export default {
  name: HOME,
  head: {
    title: HOME,
  },
  data() {
    return {
      title: HOME
    }
  },
  components: {
    TheTitle,
    ExternalLink
  }
}
</script>
