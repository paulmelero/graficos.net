import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { join } from 'node:path'

import { sync } from './sync.mjs'

const here = import.meta.dirname

await sync()

let timer
const refresh = () => {
  clearTimeout(timer)
  timer = setTimeout(() => sync().catch((error) => console.error(error)), 100)
}

const issuesWatcher = watch(join(here, '../content/newsletter'), { recursive: true }, refresh)
const sentWatcher = watch(join(here, 'sent.json'), refresh)

const child = spawn('npx', ['maizzle', 'serve'], { stdio: 'inherit', cwd: here })

const stop = () => {
  issuesWatcher.close()
  sentWatcher.close()
  child.kill('SIGINT')
  process.exit(0)
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

child.on('exit', (code) => {
  issuesWatcher.close()
  sentWatcher.close()
  process.exit(code ?? 0)
})
