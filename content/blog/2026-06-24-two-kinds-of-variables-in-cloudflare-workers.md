---
lang: EN
title: 'Two Kinds of Variables in Cloudflare Workers'
date: 2026-06-24
thumbnail: /images/uploads/cf_vars/3.png
tags:
  - Cloudflare
  - Cloudflare Workers
  - Nuxt
  - Nitro
  - Environment Variables
  - SSR
  - DevOps
description: "Why an environment variable can 'exist' in your Cloudflare config and still be missing at runtime — the build vs. runtime split, and the Nuxt useRuntimeConfig vs. process.env footgun."
summary: "Why an environment variable can 'exist' in your Cloudflare config and still be missing at runtime — the build vs. runtime split, and the Nuxt useRuntimeConfig vs. process.env footgun."
---

Working with Nuxt makes it super easy to work with environment variables. You just need to add them to the `.env` file and they will be available in the `process.env` object. More so, if you are using the `runtimeConfig` feature, you can access them in your code using the `useRuntimeConfig()`. Also, nuxt populates the `process.env` object AND the `runtimeConfig` object with the variables from the `.env` file (or if you expose them in other ways in your machine).

But one day, you want to add them in Cloudflare Workers because you want to use them in production, and you discover that Cloudflare has 2 different environments for variables: build variables and runtime variables. Workers treat secrets differently depending on where they live.

Combining the 2 had more nuances than I expected, and it took me a while to figure out why my CUSTOM_ENV_VARS were not available in my Cloudflare Workers runtime code.

## The mental model about build and runtime variables

Before we dive into the details, let's understand one basic difference. There are two distinct phases, and each has its own environment:

1. **Build time** — your CI runs the build command (`nuxt build`, then `wrangler deploy`). Build variables exist here and only here.
2. **Runtime** — the deployed Worker serves traffic. Runtime variables and secrets are bound to the Worker and available on every request.

Build variables are like the oven settings. They are used to configure the build process. Runtime variables and secrets are like the ingredients in the dish. They are used to configure the runtime behavior of the Worker.

## Side by side

|                               | **Build variable**                                   | **Runtime variable / secret**                          |
| ----------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| **Where it lives**            | CI build environment (Settings → Build)              | The deployed Worker (Settings → Variables & Secrets)   |
| **When it's available**       | Build time only, while the build/deploy command runs | Per request, on the `env` binding (\*)                 |
| **Visible to live Worker?**   | No (unless you bind it manually to runtime code)     | Yes                                                    |
| **How a change takes effect** | Triggers / needs a **rebuild**                       | Next **deployment** — no rebuild                       |
| **Encryption options**        | Plaintext, or "build secret" (masked in build logs)  | **Text** (plaintext) or **Secret** (encrypted at rest) |
| **Typical use**               | Build-time config, codegen inputs, public flags      | API keys, tokens, per-environment runtime config       |

Two things worth pinning down. A "build secret" only means _encrypted for the build_ — it is still gone at runtime. And a runtime **Secret** is write-only: you set it once and can never read it back through the dashboard or API.

(\*) The `env` binding is a special binding that is available in the Worker's runtime. Example API:

```ts
// inside Worker code
import { env } from 'cloudflare:workers'

const { MY_VARIABLE } = env
```

## Difference between "deployments" and "builds" (_the more you know..._)

This is something that clicked when I was debugging environment variables. Since one of the latest Cloudflare UI redesigns, I was confused about the difference between the "Deployment" and "Build" sections in "Workers > Deployments".

<figure>
  <img src="/images/uploads/cf_vars/2.png" alt="Cloudflare dashboard: Workers > Deployments and Builds" loading="lazy">
  <figcaption>
    Cloudflare dashboard: Workers > Deployments (1) and Builds (2) are different lists. Weirdly, separated in 2 views.
  </figcaption>
</figure>

The fact that you need an extra click to see builds and trigger one (as far as I know) was and still is confusing to me. But at least, it made me realize that builds and deployments are different things.

- **Deployments**: include all the deployments to production, including changes in the code, variables and manual deployments (either via `wrangler` CLI or the dashboard).
- **Builds**: include all the builds triggered by code changes or manual builds (via `wrangler` CLI or the dashboard).

- If you need new runtime variables, a deployment (no build) suffices. ✨
- If you need new build variables, you need to create a new build.

## Runtime variables and secrets: the limits

- **Absent during the build.** Build-time codegen can't see them — they don't exist yet when `nuxt build` (for example) runs.
- **Secrets are write-only.** You can't read a Secret back. Lost it? Rotate it.
- ⚠️ **Text vars are visible.** Plaintext Text variables are readable in the dashboard. Don't put credentials in them — use a Secret. It's the equivalent of writing down the password on a piece of paper and leaving it on the desk.

<figure>
  <img src="/images/uploads/cf_vars/3.png" alt="Configuring a runtime variable or secret in the Cloudflare dashboard">
  <figcaption>
    Runtime variables &amp; secrets live under Settings → Variables &amp; Secrets, and are available to the Worker on every request.
  </figcaption>
</figure>

## Build variables: the limits

- **Invisible at runtime.** The docs are clear: [_"Build variables will not be accessible at runtime."_](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#:~:text=Build%20variables%20will%20not%20be%20accessible%20at%20runtime) If runtime code tries to get it from `process.env`, it will find nothing.
- **A build freezes the value.** If you inline a build variable into your bundle, it's frozen at the value present during that build. It stays unchanged until the next build.
- ⚠️ **Secrets can leak into the artifact.** Marking a build variable `is_secret: true` masks it in the build _logs_. It does not stop your bundle from inlining the value into the output build that ships.

<figure>
  <img src="/images/uploads/cf_vars/4.png" alt="Configuring a build variable in the Cloudflare dashboard" loading="lazy" decoding="async">
  <figcaption>
    Build variables live under Settings → Build, and only exist while the build command runs.
  </figcaption>
</figure>

## The Nuxt trap: `runtimeConfig` vs `process.env`

This is where SSR developers get bitten, because Nuxt exposes **two different surfaces** for configuration and they don't resolve to the same values by default and less so in Cloudflare Workers.

**`runtimeConfig`** is resolved at _build_ — Nuxt reads `process.env` during `nuxt build` and bakes the values in. At _runtime_, Nuxt overrides those keys from environment variables using the `NUXT_`-prefix convention. Uppercase, underscores mark nested keys:

| Variable               | Runtime Config Path            | Client-side?                    |
| ---------------------- | ------------------------------ | ------------------------------- |
| `NUXT_API_SECRET`      | `runtimeConfig.apiSecret`      | Not available in client-code    |
| `NUXT_PUBLIC_API_BASE` | `runtimeConfig.public.apiBase` | Publicly visible in client-code |

Crucially, that override **only rewrites the object returned by `useRuntimeConfig()`**. It does _not_ write the value back into `process.env` if you only configured the Nuxt config file.

> If you want to read how Nuxt populates the `runtimeConfig` object, you can read [the docs](https://nuxt.com/docs/4.x/guide/going-further/runtime-config#environment-variables).

💡 **The important thing to remember is that**:

- Nuxt reads from `process.env` when building `runtimeConfig`.
- Your code (or a Worker) can also read `process.env` directly.

The mental model in local development is easier. But it can be confusing when working with Cloudflare Workers.

❕ **In Cloudflare Workers**:

**`process.env`** on a Worker is empty by default. It gets auto-populated from the Worker's runtime variables and secrets only when **`nodejs_compat` is enabled** _and_ your **compatibility date is ≥ `2025-04-01`** (the `nodejs_compat_populate_process_env` default; it's on by default at/after that date, and can also be set explicitly). Build variables never appear there. [See docs for more information.](https://developers.cloudflare.com/workers/configuration/environment-variables/#environment-variables-and-nodejs-compatibility)

```jsonc
// wrangler.jsonc
{
  "compatibility_date": "2025-07-20",
  "compatibility_flags": ["nodejs_compat"],
}
```

The consequence: these two reads do **not** see the same thing.

```ts
const config = useRuntimeConfig() // NUXT_-prefixed overrides + exposed env vars in commands + runtimeConfig (build-baked) values
const direct = process.env.FOO // only if `nodejs_compat` + compat date ≥ 2025-04-01 + only if it's a runtime variable (not a build variable)
```

A value can be present via one path and absent via the other depending on the context. 😵‍💫

### A concrete example: Nuxt Studio

Here's a real-world example of how this can bite you.

_Note: This is just an example of how a third-party could be affected by the Cloudflare environment variables nuance._

Nuxt Studio accepts the same GitHub OAuth credential under **two runtime names, through two different means**:

- `NUXT_STUDIO_AUTH_GITHUB_CLIENT_ID` (Or manual `runtimeConfig.studio.auth.github.clientId` or module options). This is [the env var name the setup docs tell you to use](https://nuxt.studio/setup#auth-provider) (at the time of writing).
- `STUDIO_GITHUB_CLIENT_ID` (un-prefixed) — read straight from `process.env` by a [per-request server middleware (`studio-env.ts`)](https://github.com/nuxt-content/nuxt-studio/blob/eff20b70095918c1a63bf5dcccca1d457dab215c/src/module/src/runtime/server/middleware/studio-env.ts#L19), which backfills the _same_ config field:

```ts
// studio-env.ts — runs per request, bridges process.env into runtimeConfig
const config = useRuntimeConfig(event)
// ...
const github = config.studio.auth.github
github.clientId = github.clientId || process.env.STUDIO_GITHUB_CLIENT_ID || '' // depends on what you confgured in CF and in your code
```

But then, both the [login entry route (`admin.ts`)](https://github.com/nuxt-content/nuxt-studio/blob/eff20b70095918c1a63bf5dcccca1d457dab215c/src/module/src/runtime/server/routes/admin.ts#L17) and [the OAuth route (`auth/github.get.ts`)](https://github.com/nuxt-content/nuxt-studio/blob/eff20b70095918c1a63bf5dcccca1d457dab215c/src/module/src/runtime/server/routes/auth/github.get.ts#L87) then read **`useRuntimeConfig(event).studio`** — neither reads `process.env` directly.

If no provider resolves, Nuxt Studio ([in `admin.ts`](https://github.com/nuxt-content/nuxt-studio/blob/eff20b70095918c1a63bf5dcccca1d457dab215c/src/module/src/runtime/server/routes/admin.ts#L24-L27)) throws:

```ts
throw createError({ statusCode: 404, message: 'No authentication provider found' })
```

🧨 Now the trap. Whether the credential reaches the code comes down to two questions: did you **manually map `runtimeConfig` to `process.env`** in `nuxt.config`, and is **`nodejs_compat`** on?

- **You manually mapped `runtimeConfig` → `process.env`** (in `nuxt.config`), and used a build var **with `nodejs_compat` and a sufficient compat date** → ✅
  - missing any of those steps → 💥
- **No manual `runtimeConfig` mapping** (you rely on the module's defaults), **with `nodejs_compat` on**:
  - only build vars → 💥
  - only `STUDIO_GITHUB_CLIENT_ID` (whether in build vars or runtime vars):
    - `config.studio.auth.github` could break in the future if the module ever stops falling back to `STUDIO_GITHUB_CLIENT_ID` — risky on their side, IMO
    - but `STUDIO_GITHUB_CLIENT_ID` alone in runtime variables in CF works now → ✅
  - only `NUXT_STUDIO_AUTH_GITHUB_CLIENT_ID`? → ❓ TBH, I did not try this path. The [docs say](https://nuxt.studio/setup#auth-provider) it should work, but I can't see why: (⁉) I'd expect it to be transformed to `client.id`, not `clientId`. Module options have `clientId` when used directly, but I don't know whether Nuxt maps the env var to module options under the hood.

## Checklist

- **Does the value need to be available while serving requests?** → runtime variable / secret.
- **Only needed during the build?** → build variable.
- **Reading it via `process.env` in a Worker?** → confirm `nodejs_compat` is on, your compatibility date is ≥ `2025-04-01`, and that it's a _runtime_ value — not a build one.
- **Mixing `useRuntimeConfig()` and `process.env`?** → they're different surfaces. Verify the specific one your code path actually reads.
- **Did you map `runtimeConfig` to `process.env` variables in the `nuxt.config` file?** → The value you will get with `useRuntimeConfig()` may not be the same as the one you will get with `process.env`. `runtimeConfig` is meant for fallback values and the values you pass cannot be overridden by `process.env`. If you want to override a value you used in the `runtimeConfig` object, you need to use `NUXT-`-prefixed variables in Runtime variables / secrets. If you want to know more about this, see this [YouTube video by Alexander Lichter](https://www.youtube.com/watch?v=_FYV5WfiWvs).

ℹ️ _One caveat_: the `2025-04-01` `compatibility-date` threshold is current as of writing, but Cloudflare's defaults evolve — check the [current docs](https://developers.cloudflare.com/workers/configuration/environment-variables/) before you rely on it.

## Conclusion

- Today I learned something new about Cloudflare Workers and how to work with their environment variables.
- I'm glad I debugged Nuxt Studio and made the basic setup with GitHub OAuth work within Cloudflare Workers.
- Cloudflare should improve their UI.
- I should contribute to Nuxt Studio to improve the docs, specially for Cloudflare users.

I hope this article helped you. If you found it useful, please consider sharing it with your friends and colleagues. If you have any questions or comments, please feel free to [contact me](/contact). 🙋🏽‍♂✨
