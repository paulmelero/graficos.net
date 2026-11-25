import { execFile } from 'node:child_process'
import { pathToFileURL } from 'node:url'

import { build } from './build.mjs'

const slug = process.argv[2]
const issues = await build()
const issue = slug ? issues.find((item) => item.slug === slug) : issues.at(-1)

if (!issue) {
  console.error(
    slug ? `No built issue found for "${slug}".` : 'No issues built. Add content/newsletter/<slug>.md first.'
  )
  process.exit(1)
}

const url = pathToFileURL(issue.htmlPath).href
console.log(url)

const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open'
const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url]

execFile(command, args, (error) => {
  if (error) console.error(error.message)
})
