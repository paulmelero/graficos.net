import { readFile, stat, writeFile } from 'node:fs/promises'
import { createInterface } from 'node:readline/promises'

import matter from 'gray-matter'

const args = process.argv.slice(2)
const slug = args[0]
const testIndex = args.indexOf('--test')
const testEmail = testIndex === -1 ? undefined : args[testIndex + 1]
const shouldSend = args.includes('--send')

const usage = `Usage:
  pnpm newsletter:send <slug> --test you@example.com
  pnpm newsletter:send <slug> --send`

if (!slug || slug.startsWith('--') || (!testEmail && !shouldSend) || (testEmail && shouldSend)) {
  console.error(usage)
  process.exit(1)
}

const sourcePath = `../content/newsletter/${slug}.md`
const htmlPath = `dist/${slug}.html`

const [source, html, sourceStat, layoutStat, htmlStat] = await Promise.all([
  readFile(sourcePath, 'utf8').catch(() => null),
  readFile(htmlPath, 'utf8').catch(() => null),
  stat(sourcePath).catch(() => null),
  stat('layout.vue').catch(() => null),
  stat(htmlPath).catch(() => null),
])

if (!source || !sourceStat) {
  console.error(`No issue at content/newsletter/${slug}.md`)
  process.exit(1)
}

if (!html || !htmlStat) {
  console.error(`No built HTML at newsletter/dist/${slug}.html. Run pnpm newsletter:build first.`)
  process.exit(1)
}

if (layoutStat && htmlStat.mtimeMs < Math.max(sourceStat.mtimeMs, layoutStat.mtimeMs)) {
  console.error(
    `The built HTML is older than content/newsletter/${slug}.md or newsletter/layout.vue. Run pnpm newsletter:build first.`
  )
  process.exit(1)
}

const { data } = matter(source)
const subject = data.subject || data.title

if (!subject) {
  console.error(`Add a subject or title to the frontmatter of content/newsletter/${slug}.md.`)
  process.exit(1)
}

const token = process.env.NEWSLETTER_ADMIN_TOKEN
if (!token) {
  console.error('Set NEWSLETTER_ADMIN_TOKEN in .env or your shell before sending.')
  process.exit(1)
}

const baseUrl = (process.env.NEWSLETTER_URL || 'https://newsletter.graficos.net').replace(/\/$/, '')

if (shouldSend) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await rl.question(`Send "${subject}" to the whole list? Type "yes" to continue: `)
  rl.close()

  if (answer.trim().toLowerCase() !== 'yes') {
    console.log('Cancelled.')
    process.exit(0)
  }
}

const response = await fetch(`${baseUrl}/api/send`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-admin-token': token,
  },
  body: JSON.stringify({
    subject: testEmail ? `[TEST] ${subject}` : subject,
    html,
    ...(testEmail && { testEmail }),
  }),
})

const body = await response.text()

if (!response.ok) {
  console.error(`Send failed (${response.status}): ${body}`)
  process.exit(1)
}

if (shouldSend) {
  const sent = JSON.parse(await readFile('sent.json', 'utf8').catch(() => '{}'))
  sent[slug] = new Date().toISOString()
  await writeFile('sent.json', JSON.stringify(sent, null, 2) + '\n')
}

console.log(testEmail ? `Test sent to ${testEmail}.` : `Queued: ${body}`)
