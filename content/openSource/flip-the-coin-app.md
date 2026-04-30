---
title: FlipTheCoin.app — PWA, Browser Extension, and Blog
summary: A web app, PWA, browser extension, and blog, all in a mono repo.
description: FlipTheCoin.app is a web app and browser extension to simulate coin flips with a physics engine in the browser. It is open source.
tags: [open-source, web-app, browser-extension, physics, javascript]
yearCreated: 2025
url: https://flipthecoin.app/
repositoryUrl: https://github.com/paulmelero/flipthecoin.app/
license: MIT
---

> FlipTheCoin.app is a web app and browser extension to simulate coin flips with a physics engine in the browser.

It is a simple PWA (Progressive Web App) and browser extension that allows you to simulate coin flips with a physics engine in the browser.

You can find the code on [GitHub](https://github.com/paulmelero/flipthecoin.app/).

## Coin simulation

The [coin simulation](https://flipthecoin.app/play) is powered by a physics engine that simulates the coin flip. I explained how it works in this article: https://flipthecoin.app/blog/how-we-toss-a-coin and you can find the code on [the repository](https://github.com/paulmelero/flipthecoin.app/blob/main/packages/coin-engine/src/useThreeJsCoin.ts).

## Browser extension

The [browser extension](https://flipthecoin.app/extension) is a simple extension that allows you to simulate coin flips with a physics engine in the browser.

You can find the code on [GitHub](https://github.com/paulmelero/flipthecoin.app/tree/main/extension).

What is interesting about the browser extension is I reuse the same physics engine code from the web app to simulate the coin flip in the browser extension. I share the code between the 2 "apps" thanks to the pnpm monorepo setup I configured and thanks to having a shared `packages` folder.

## Blog

For now, the web is really dummy so, at least, I wanted to write some blog posts about some interesting things I learned while building it and some cool physics and probability concepts I discovered.

For me it's a way to learn more about Maths and enjoy something I am passionate about, while sharing it with others.

## Why I built it

Aside from what I just mentioned, I also wanted to build a more complex game involving coin flips. At the same time, I have mixed feelings about games that could become too addictive. And this one, being about a coin..., I just despise everything related to gambling and casinos. So, I don't want to build anything that could trigger anxiety or addiction issues. I am being cautious not to use the same imagery as traditional games that are strongly related to "coin games". For now, the plans to build a more complex game are on hold, but I might come back to it later.

This is another reason why I started the blog with knowledge-sharing posts. I want the site to be useful for others. Something math enthusiast or students can find funny and instructive.
