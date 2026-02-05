---
title: [SAFE]Reader
summary: It's a small and simple reader app that allows you to read articles from your favorite sites without annoying "Accept Cookies or Pay" walls.
description: It's a Nuxt 3 app that uses an iframe to load the external URLs. It is deployed on Github Pagees, and open source.
tags: [open-source, nuxt, Github Pages]
yearCreated: 2025
url: https://safe-reader.graficos.net/
repositoryUrl: https://github.com/paulmelero/safe-reader
---

Many media outlets have started to charge for access to their content if you don't accept their cookies or subscriptions, and they have become very aggressive with their "Accept Cookies or Pay" walls. This has made it difficult to read articles from these sites on Mobile, specially if you want to conserve your privacy and not accept their cookies.

I created this mini-PWA to have it installed on my phone, and be able to read articles from these sites without having to deal with their annoying cookie-walls.

The app renders the articles in an iframe, using `sandbox="allow-same-origin allow-forms"`, which blocks third-party cookies and scripts, but allows the content to be displayed.

I also added a "Reader Mode" button that removes all the styles and images from the article, leaving only the text, which makes it easier to read on mobile devices.

## Usage

Go to the [[SAFE]Reader app](https://safe-reader.graficos.net/) and enter the URL of the article you want to read. The app will load the article in an iframe, and you can read it without having to deal with the cookie-walls.
