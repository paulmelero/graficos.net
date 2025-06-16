---
title: Safe Reader
summary: It's a small and simple reader app that allows you to read articles from your favorite sites without annoying "Accept Cookies or Pay" walls.
description: It's a Nuxt 3 app that uses an iframe to load the external URLs. It is deployed on Github Pagees, and open source.
tags: [open-source, nuxt, Github Pages]
yearCreated: 2025
url: https://paulmelero.github.io/safe-reader/
repositoryUrl: https://github.com/paulmelero/safe-reader
---

In Spain, many media outlets have started to charge for access to their content if you don't accept their cookies, and they have become very aggressive with their "Accept Cookies or Pay" walls. This has made it difficult to read articles from these sites on Mobile, specially if you want to conserve your privacy and not accept their cookies.

I created this mini-PWA to have it installed on my phone, and be able to read articles from these sites without having to deal with their annoying cookie-walls.

The app renders the articles in an iframe, using `sandbox="allow-same-origin allow-forms"`, which blocks third-party cookies and scripts, but allows the content to be displayed.

It does not work for all sites. Sites that use `X-Frame-Options: DENY` or `SAMEORIGIN` will not work, and sites that use `Content-Security-Policy: frame-ancestors 'none'` will also not work.

## Usage

Go to the [Safe Reader app](https://paulmelero.github.io/safe-reader/) and enter the URL of the article you want to read. The app will load the article in an iframe, and you can read it without having to deal with the cookie-walls.
