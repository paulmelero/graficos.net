<template>
  <nav class="flex items-center bg-primary" role="navigatioon">
    <nuxt-link
      class="flex items-center flex-no-shrink text-white mx-6 py-4 disable-underline"
      to="/"
    >
      <img src="~/static/logo/graficos.svg" alt="Graficos.net Logo" class="h-8">
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
  </nav>
</template>

<script>
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
  }
}
</script>

