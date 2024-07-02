<template>
  <nav
    class="flex items-center bg-primary dark:bg-primaryDark dark:text-fwhite overflow-hidden"
    aria-label="Main Navigation"
  >
    <nuxt-link
      class="flex items-center text-black hover:text-action dark:text-fwhite dark:hover:text-actionDark flex-no-shrink mx-6 py-4 disable-underline disable-transition disable-hover"
      to="/"
      aria-label="Go to Home Page"
    >
      <images-logo class="h-8 transition:color disable-hover" />
    </nuxt-link>
    <ul class="pl-0 h-full w-full flex-1 flex-grow items-center my-0 flex sm:justify-start justify-end">
      <li v-for="(link, i) in sections" :key="i" class="inline-block">
        <nuxt-link
          :to="link.href"
          :title="link.title"
          class="my-0 text-sm text-black hover:text-action dark:text-fwhite dark:hover:text-actionDark disable-hover mr-4"
          >{{ link.name }}</nuxt-link
        >
      </li>
    </ul>
    <div class="hidden sm:flex mr-2">
      <images-social-networks class="sm:flex"></images-social-networks>
      <ColorScheme placeholder="...">
        <button
          @click="onColorModeToggle"
          class="flex items-center justify-center w-8 rounded-full p-0 ml-3 relative before:content-[''] before:pointer-events-none before:w-1 before:h-full before:absolute before:-left-2 before:bg-secondary before:dark:hover:bg-actionDark"
          aria-label="Toggle color mode"
          type="button"
        >
          <Icon size="24" v-if="colorMode.preference === 'dark'" name="octicon:moon-16" />
          <Icon size="24" v-if="colorMode.preference === 'system'" name="octicon:codespaces-24" />
          <Icon size="24" v-if="colorMode.preference === 'light'" name="octicon:sun-16" />
        </button>
      </ColorScheme>
    </div>
  </nav>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const colorModes = ['dark', 'light', 'system']
const onColorModeToggle = () => {
  // preference can be: 'dark', 'light', 'system' or 'unknown'
  colorMode.preference = colorModes[(colorModes.indexOf(colorMode.preference) + 1) % colorModes.length]
}
const sections = [
  {
    href: '/blog',
    name: 'Blog',
    title: 'Blog',
  },
]
</script>

<style scoped>
abbr[title] {
  text-decoration: none;
}
</style>
