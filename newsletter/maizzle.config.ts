import { defineConfig } from '@maizzle/framework'

export default defineConfig({
  content: ['layout.vue', 'issues/**/*.vue'],
  output: { path: 'dist' },
  url: {
    base: {
      url: 'https://graficos.net',
      tags: ['img', 'source', 'a'],
    },
  },
  html: { minify: true },
  plaintext: true,
  server: { port: 3333, watch: ['../content/newsletter/*.md'] },
})
