import { fileURLToPath } from 'node:url'

import { setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

await setup({
  rootDir: fileURLToPath(new URL('..', import.meta.url)),
  build: true,
  server: true,
  nuxtConfig: {
    nitro: { preset: 'node-server' },
    content: { database: { type: 'sqlite', filename: '.data/smoke-content.sqlite' } },
  },
})

const routes = [
  '/',
  '/blog',
  '/blog/2026-01-13-what-is-a-senior-engineer',
  '/blog/tag/typescript',
  '/collections',
  '/collections/fonts',
  '/contact',
  '/newsletter',
  '/newsletter/drops',
  '/newsletter/drop-001',
  '/opensource',
  '/opensource/graficos-net',
  '/privacy',
  '/slashes',
  '/slashes/uses',
]

describe('smoke', () => {
  it.each(routes)('renders %s', async (route) => {
    const response = await fetch(url(route))

    expect(response.status).toBe(200)
    expect(await response.text()).toContain('<!DOCTYPE html>')
  })

  it('renders a 404 page', async () => {
    const response = await fetch(url('/this-route-does-not-exist'))

    expect(response.status).toBe(404)
  })

  it('serves the Atom feed', async () => {
    const response = await fetch(url('/feed'))

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toContain('application/atom+xml')

    const body = await response.text()

    expect(body).toContain('<feed xmlns="http://www.w3.org/2005/Atom">')
    expect(body).toContain('<title>graficos.net</title>')
    expect(body).toContain('<entry>')
    expect(body).toContain('https://graficos.net/blog/2026-01-13-what-is-a-senior-engineer')
  })
})
