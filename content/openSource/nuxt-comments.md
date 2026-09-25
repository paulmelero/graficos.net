---
title: nuxt-comments — Comments for Nuxt
summary: A reusable Nuxt 4 module that adds threaded comments to any Nuxt site, backed by Cloudflare D1 and authenticated through the host app's Better Auth setup.
description: nuxt-comments is an embeddable, unstyled comments module for Nuxt 4, backed by Cloudflare D1 and authenticated via Better Auth. It is open source.
tags: [open-source, nuxt, nuxt-module, cloudflare, cloudflare-d1, better-auth, comments, typescript]
yearCreated: 2026
repositoryUrl: https://github.com/graficos/nuxt-comments
license: Apache-2.0
---

> An embeddable, unstyled comments system for Nuxt 4, backed by Cloudflare D1 and Better Auth.

`nuxt-comments` is a reusable comment system Nuxt module. It ships the threaded comments primitive — data model, API, composables, and unstyled components — and leaves identity to the host application's [Better Auth](https://better-auth.nuxt.dev) setup and presentation to consumers.

I built it to add comments multiple sites I own without depending on an external service or an embed script. Comments live in a Cloudflare D1 database, and each installation gets its own DB.

## What it does

- Threaded comments with arbitrary nesting, plus cursor-based pagination
- Custom reactions with configurable types and database-enforced uniqueness
- Server-side ownership checks and soft deletion that preserves threads
- Shared validation with a consistent HTTP errors
- Unstyled, accessible components with typed slots and per-layer class props

## Status

The project is still a work in progress (`v0.5.1` at the time of writing this) and there is no hosted demo or website yet. The module and its documentation live on [GitHub](https://github.com/graficos/nuxt-comments).
