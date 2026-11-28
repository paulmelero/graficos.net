// Nitro externalizes the client-only SQLite wasm import. Give the dev server a usable URL
// instead of letting Node try to parse the .wasm file as JavaScript.
// oxlint-disable typescript/no-require-imports -- this module is loaded as CommonJS
const { join } = require('node:path')
const { pathToFileURL } = require('node:url')

module.exports = pathToFileURL(join(process.cwd(), 'node_modules/@sqlite.org/sqlite-wasm/dist/sqlite3.wasm')).href
