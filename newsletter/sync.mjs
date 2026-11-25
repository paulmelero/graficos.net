import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const here = import.meta.dirname
const sourceDir = join(here, '../content/newsletter')
const outputDir = join(here, 'issues')
const sentPath = join(here, 'sent.json')

export async function sync() {
  const sent = JSON.parse(await readFile(sentPath, 'utf8').catch(() => '{}'))

  const files = (await readdir(sourceDir).catch(() => []))
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .sort()

  const keep = new Set()

  for (const file of files) {
    const slug = file.slice(0, -3)
    const group = sent[slug] ? 'sent' : 'draft'
    const dir = join(outputDir, group)
    await mkdir(dir, { recursive: true })

    const target = join(dir, `${slug}.vue`)
    const wrapper = `<script setup lang="ts">
import matter from 'gray-matter'
import raw from '../../../content/newsletter/${file}?raw'
import EmailLayout from '../../layout.vue'

const { data, content } = matter(raw) as { data: any; content: string }
</script>

<template>
  <EmailLayout :markdown="content" :frontmatter="data" />
</template>
`

    await writeFile(target, wrapper)
    keep.add(target)
  }

  for (const group of ['draft', 'sent']) {
    const dir = join(outputDir, group)
    for (const file of await readdir(dir).catch(() => [])) {
      if (!file.endsWith('.vue')) continue
      const target = join(dir, file)
      if (!keep.has(target)) await rm(target)
    }
  }

  console.log(`Synced ${keep.size} issue preview(s).`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await sync()
}
