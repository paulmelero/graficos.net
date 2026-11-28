# Nuxt 4.7, Nitro 3 and Rsbuild

Migration notes for `graficos.net`.

## Versions

- Nuxt `4.7.0`
- Nitro `3.0.261103-rc`, with `nitroLegacy: false`
- `@nuxt/rsbuild-builder` `4.7.0`, with `builder: 'rsbuild'`
- Vue `3.5.46`
- `@nuxt/content` `3.17.0`
- `@nuxt/image` `2.2.1`
- `@nuxt/fonts` `1.2.1`
- `@nuxtjs/color-mode` `4.1.0`
- `@nuxt/devtools` `4.2.2` (installed; see caveat below)

## Configuration

- `experimental.staticRoutes: true`
- `experimental.viteEnvironmentApi: true`
- `experimental.clientNodeCompat: true`
- `experimental.inlineSSRStyles: false` keeps CSS out of the prerendered HTML.
- Tailwind moved from `@tailwindcss/vite` to `@tailwindcss/postcss`.
- `.agents` is excluded from Tailwind's source scan.
- `server/routes/feed.ts` uses `defineHandler` and `useRuntimeConfig` from `nuxt/server`.
- `wrangler.jsonc` became strict `wrangler.json`: Nitro 3's JSONC parser rejects trailing commas.

## Warnings addressed

- `NUXT_B7042`: Vue `3.5.45` → `3.5.46`.
- `NUXT_B9003`: `@nuxt/image` 2.2.1 and the related module upgrades no longer pull in the Nitro v2 compatibility layer.
- `NUXT_B9001`: `@nuxtjs/color-mode` still sets Nitro v2's `externals.inline`. A late module hook moves it to `noExternals` and removes it from `nuxt.options.nitro`.

## Workarounds

- **Dev server uses the Node preset.** Cloudflare's workerd dev emulation cannot load TypeScript's `node:inspector` import.
- **`sqlite3.wasm` dev alias.** `server/sqlite3-wasm.cjs` gives the dev server a usable file URL for the client-only SQLite wasm import.
- **Cloudflare local content adapter stub.** `server/content-local-adapter.stub.ts` uses `db0/connectors/better-sqlite3` only while prerendering. The worker uses D1 and never loads `node:fs`.
- **Rsbuild content template patch.** Nuxt Content's virtual `components.ts` is parsed as JavaScript. The template contents are rewritten to remove the two `: string[]` annotations and to use absolute component import paths.
- **pnpm hoisting and peers.** `.npmrc` hoists dependencies for Rsbuild and disables peer auto-install/dedupe, which deadlocks on the DevTools v4 graph.

## Rsbuild SVG icons

`nuxt-svgo` has no Rsbuild integration. Its SVG imports became data URI asset URLs on the client, so `<component :is="…">` tried to create an element whose tag name was the whole `data:image/svg+xml;base64,…` URL. That threw during hydration, which disabled router navigation and left the newsletter form falling back to a native POST.

The three social SVGs are now plain Vue components in `app/components/images/icons/`, and `nuxt-svgo` was removed. Header navigation and the newsletter submit handler were verified in headless Chrome.

## Remaining module noise

`@nuxt/fonts` 1.2.1 still registers Nitro's deprecated `rollup:before` hook on the Nitro 3 RC. It is harmless and comes from the module, not this config.

## DevTools caveat

DevTools v4 installs successfully with:

```ini
auto-install-peers=false
dedupe-peer-dependents=false
```

However, DevTools v4 logs `Nuxt DevTools only supports Vite mode, module is disabled` with Rsbuild. It is kept as a dependency but is not listed in `modules`, so it will only run after switching the builder back to Vite.

## Smoke tests

`pnpm test:smoke` builds the app with the Node preset and checks:

- prerendered pages
- content-backed dynamic pages
- tag and category pages
- opensource, newsletter and slashes routes
- the 404 page
- the Atom feed response type, XML structure, entries and article URLs

Result: 17/17 passing.

## Benchmark

Same machine, same project, baseline at commit `2c7a137` (Nuxt 4.6.4, Vite, Nitro 2), after the migration. Builds are cold (`rm -rf .nuxt .output node_modules/.cache`). Dev timing is from process spawn to the first `200`. Production uses `wrangler dev`, 16 concurrent clients, 10 seconds after a 2-second warmup.

Medians:

| Metric                     |                  Before |                   After |   Change |
| -------------------------- | ----------------------: | ----------------------: | -------: |
| Cold build                 |                 35.13 s |                 17.51 s | **−50%** |
| Dev ready                  |                 10.58 s |                 16.25 s |     +54% |
| First dynamic page compile |                  800 ms |                  644 ms |     −20% |
| Dev steady p50             |                 10.7 ms |                 11.6 ms |      +8% |
| Prod `/`                   |  880 rps / 17.05 ms p50 |  894 rps / 17.20 ms p50 |    +1.6% |
| Prod `/feed`               | 3,030 rps / 4.15 ms p50 | 3,070 rps / 4.10 ms p50 |    +1.3% |

Raw runs:

- Build before: `40.09`, `35.13`, `34.67` s
- Build after: `17.70`, `17.32` s
- Dev ready before: `12.29`, `9.56`, `10.58` s
- Dev ready after: `16.25`, `16.12`, `16.95` s
- Dynamic compile before: `785`, `1965`, `800` ms
- Dynamic compile after: `644`, `629`, `672` ms
- Prod `/` before: `887.8`, `872.8` rps
- Prod `/` after: `902.2`, `886.8` rps
- Prod `/feed` before: `3,135.5`, `2,925.1` rps
- Prod `/feed` after: `3,061.2`, `3,079.4` rps

Build is about twice as fast. Dev startup is slower because Rsbuild and Nitro 3 spend more time in module setup, but the first dynamic page compiles faster. Production throughput is effectively at parity: slightly faster on both sampled routes, within run-to-run noise.

Do not run `nuxt build` and `nuxt dev` in the same worktree at the same time: the dev server's local content SQLite database can block the prerenderer.

## Checks

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test:smoke
pnpm lint
pnpm format:check
```
