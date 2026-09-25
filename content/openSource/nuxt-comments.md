---
title: nuxt-comments — Comments for Nuxt
summary: A reusable Nuxt 4 module that adds threaded comments to any site, backed by Cloudflare D1 and authenticated through the host app's Better Auth setup.
description: nuxt-comments is an embeddable, unstyled comments module for Nuxt 4, backed by Cloudflare D1 and authenticated via Better Auth. It is open source.
tags: [open-source, nuxt, nuxt-module, cloudflare, cloudflare-d1, better-auth, comments, typescript]
yearCreated: 2026
repositoryUrl: https://github.com/graficos/nuxt-comments
license: Apache-2.0
---

> An embeddable, unstyled comments system for Nuxt 4, backed by Cloudflare D1.

`nuxt-comments` is a reusable Nuxt module, not a hosted widget. It ships the threaded comments primitive — data model, API, composables, and unstyled components — and leaves identity to the host application's [Better Auth](https://better-auth.nuxt.dev) setup and presentation to you.

I built it to add comments to this site without depending on an external service or an embed script. Comments live in a Cloudflare D1 database, and each installation gets its own.

## What it does

- Threaded comments with arbitrary nesting, plus cursor-based pagination
- Reactions with configurable types and database-enforced uniqueness
- Server-side ownership checks and soft deletion that preserves threads
- Shared validation with a consistent HTTP error envelope
- Unstyled, accessible components with typed slots and per-layer class props

## Status

The project is still a work in progress (`@graficos/nuxt-comments` v0.5.1) and there is no hosted demo or website yet. The module and its documentation live on [GitHub](https://github.com/graficos/nuxt-comments).
