import { render } from '@maizzle/framework'
import matter from 'gray-matter'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { basename, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const sourceDir = '../content/newsletter'
const outputDir = 'dist'

export async function build() {
  await mkdir(outputDir, { recursive: true })

  const files = (await readdir(sourceDir).catch(() => []))
    .filter((file) => file.endsWith('.md') && !file.startsWith('_'))
    .sort()

  const built = []

  for (const file of files) {
    const slug = basename(file, '.md')
    const raw = await readFile(join(sourceDir, file), 'utf8')
    const { data, content } = matter(raw)

    if (data.draft) continue

    const { html, plaintext } = await render('layout.vue', {
      props: { markdown: content, frontmatter: data },
      plaintext: true,
      html: { minify: true },
      url: { base: 'https://graficos.net' },
    })

    const htmlPath = join(outputDir, `${slug}.html`)
    await writeFile(htmlPath, html)

    let textPath
    if (plaintext) {
      textPath = join(outputDir, `${slug}.txt`)
      await writeFile(textPath, plaintext)
    }

    built.push({ slug, htmlPath, textPath })
    console.log(`Built ${htmlPath}`)
  }

  if (!built.length) {
    console.log('No issues found in content/newsletter/')
  }

  return built
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await build()
}
