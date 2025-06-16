---
title: Odds API (Odds and End—points—s)
summary: Have you ever wondered how many times a certain event has occurred? Or how likely it is to be struck by a lightning or how many times a specific number has been drawn in a lottery? This API provides you with the odds of these events happening.
description: Odds API is a RESTful API that provides odds facts for various fun facts. Built with Nitro and deployed on Cloudflare, it is a simple and fun API to use.
tags: [open-source, nitro, cloudflare, typescript, statisticcs, api]
yearCreated: 2025
url: https://odds-api.graficos-net.workers.dev/1/5
repositoryUrl: https://github.com/paulmelero/odds-api
license: MIT
---

> Have you ever wondered how many times a certain event has occurred? Or how likely it is to be struck by a lightning or how many times a specific number has been drawn in a lottery? This API provides you with the odds of these events happening.

This was a fun project I started in 2025, and it has been a great way to learn more about Nitro and Cloudflare Workers. The API is built with [Nitro](https://nitro.build/), which is [Nuxt](https://nuxt.com/)'s server engine that can power server apps, like this Rest API, and it is deployed on [Cloudflare Workers](https://workers.cloudflare.com/), which is a serverless platform that allows you to run your code at the edge.

## Usage

The API expects a GET request to an odds endpoint, and it returns a JSON response with the odds facts.

### Example

```bash
curl https://odds-api.graficos-net.workers.dev/1/5
```

I don't plan to add many features to this API, but I will keep it updated with new odds facts as I find them. The API is open source, and you can contribute to it by adding new odds facts or improving the existing ones.

It will stay a small and fun project, making a wordplay on the phrase ["odds and ends"](https://dictionary.cambridge.org/dictionary/english/odds-and-ends)—which refers to various small, unimportant, or miscellaneous items. The API is a collection of odds facts that are fun to read and share and will stay small and unimportant.
