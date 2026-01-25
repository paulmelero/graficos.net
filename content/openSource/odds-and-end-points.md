---
title: Odds API (Odds and End—points—s)
summary: Have you ever wondered how many times a certain event has occurred? Or how likely it is to be struck by a lightning or how many times a specific number has been drawn in a lottery? This API provides you with the odds of these events happening.
description: Odds API is a RESTful API that provides odds facts for various fun facts. Built with Nitro and deployed on Cloudflare, it is a simple and fun API to use.
tags: [open-source, nitro, cloudflare, typescript, statisticcs, api, nuxt]
yearCreated: 2025
url: https://odds-and-endpoints-web.graficos-net.workers.dev/
repositoryUrl: https://github.com/paulmelero/odds-api
license: MIT
---

> Have you ever wondered how many times a certain event has occurred? Or how likely it is to be struck by a lightning or how many times a specific number has been drawn in a lottery? This API provides you with the odds of these events happening.

This was a fun project I started in 2025, and it has been a great way to learn more about Nitro and Cloudflare Workers. The API is built with [Nitro](https://nitro.build/), which is [Nuxt](https://nuxt.com/)'s server engine that can power server apps, like this Rest API, and it is deployed on [Cloudflare Workers](https://workers.cloudflare.com/), which is a serverless platform that allows you to run your code at the edge.

## API

The API expects a GET request to an odds endpoint, and it returns a JSON response with the odds facts.

### Example

```bash
curl https://odds-api.graficos-net.workers.dev/1/5
```

I don't plan to add many features to this API, but I will keep it updated with new probability facts as I find them. The API is open source, and you can contribute to it by adding new odds or improving the existing ones.

It will stay a small and fun project, making a wordplay on the phrase ["odds and ends"](https://dictionary.cambridge.org/dictionary/english/odds-and-ends)—which refers to various small, unimportant, or miscellaneous items. The API is a collection of facts that are fun to read and share and will stay small and unimportant.

## Web (🚧WIP)

The API also has a simple web interface that allows you to query the odds facts without using curl or any other HTTP client. You can access the web interface at [odds-and-endpoints-web.graficos-net.workers.dev](https://odds-and-endpoints-web.graficos-net.workers.dev/) (domain subject to change, maybe).

The website is built with [Nuxt](https://nuxt.com/), and it uses the same Nitro server engine as the API. It is also deployed on Cloudflare Workers.

> It's still a work in progress, but you can try it out and see how it works.

I love applied math and statistics, so this project is a fun way to combine my interests in programming and math. If you have any suggestions or ideas for new odds facts, feel free to open an issue or a pull request on the [GitHub repository](https://github.com/paulmelero/odds-and-endpoints)
