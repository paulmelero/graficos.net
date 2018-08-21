<template>
  <nav class="flex items-center justify-between flex-wrap bg-primary p-6">
    <div class="flex items-center flex-no-shrink text-white mr-6">
      <img src="~/static/logo/graficos.svg" alt="Graficos.net Logo" class="h-8">
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <nuxt-link
          v-for="(link, i) in sections"
          :key="i"
          :to="link.href"
          :title="link.title"
          class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4"
        >
          {{ link.name }}
        </nuxt-link>
      </div>
      <!-- <div>
        <a href="#" class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal hover:bg-white mt-4 lg:mt-0">Download</a>
      </div> -->
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

