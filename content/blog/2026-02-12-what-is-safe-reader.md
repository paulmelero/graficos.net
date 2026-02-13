---
title: I created a mini-PWA to read articles without cookie walls
summary: As I was getting annoyed by the "Accept Cookies or Pay" walls on many media outlets, I created a small and simple reader app called [SAFE]Reader that allows you to read articles from your favorite sites without having to give away your privacy.
description: I created this mini PWA to provide a better reading experience on mobile devices by blocking third-party cookies and scripts, while still allowing the content to be displayed.
tags:
  - open-source
  - nuxt
  - Cloudflare Workers
  - PWA
  - Privacy
  - Anarchy
lang: EN
date: 2026-02-12
modifiedDate: 2026-02-13
thumbnail: /images/uploads/safe-reader.avif
---

## What is \[SAFE\]Reader?

As I shared last year in the [/open-source/safe-reader](https://graficos.net/opensource/safe-reader) post, I created a tool to read articles in a more privacy-friendly way, without having to deal with the "Accept Cookies or Pay" walls that many media outlets have implemented.

## Why would you need to care about reading articles without accepting cookies?

Some media outlets are quite aggressive with their cookie walls, and they make it very difficult to read their articles on mobile devices, especially if you want to conserve your privacy and not accept their cookies.

Your privacy gets compromised to a certain extent when you accept the cookies since your personal data gets shared with third parties, and you get tracked across the web.

Having worked in media companies in the past, and knowing how tracking systems work, the amount of data that gets collected from users sometimes is quite alarming. And I would say that most companies do not fully respect GDPR in the EU and do not provide users with a clear and easy way to opt-out of tracking.

- In Spain (and most EU countries) we even have laws to request companies to delete all our data[^grpr-deletion], or to access[^access-right] all the data they have collected about us, but in practice, these laws are not always respected, and it can be quite difficult to get companies to comply with these requests.

What kind of data gets collected? It can be anything from your browsing history, to your location (or IP), to your device information, to your interests, and much more. This data is then used to create a profile of you, which can be used for targeted advertising, or even sold to third parties. Have you heard about the Cambridge Analytica scandal? That was a clear example of how data can be misused, and how it can have a huge impact on people's lives.

## How does the \[SAFE\]Reader work?

I'm going to provide a rather technical explanation of how the app works here, since this is my tech blog, but if you want a simpler explanation, you can check the [/open-source/safe-reader](https://graficos.net/opensource/safe-reader) post or even the [about page of the app](https://safe-reader.graficos.net/en/about).

### Basic `iframe` method

The default rendering method of the app is to load the external URLs in an iframe, using `sandbox="allow-same-origin allow-forms"`, which **blocks third-party cookies and scripts**, but allows the content to be displayed. This way, you can read the articles without having to deal with the cookie walls, that are normally JS-driven, and without compromising your privacy, since no client-side tracking is recorded during the navigation.

### Fallback "Reading Mode" method

Some sites, however, block this method and do not allow their content to be loaded in a sandboxed iframe, so I implemented a fallback method that uses a **Cloudflare Worker** to fetch the content of the article on the server side, and then render it in the app. This way, we can bypass the restrictions of the iframe, and still provide a way to read the articles without accepting cookies.

I'm particularly proud of this fallback method, since:

- It uses `@mozilla/readability` to extract the main content of the article, which is the same library that Firefox uses for its Reader Mode, so it provides a very good reading experience.
- I also use the libraries `linkedom` and `DOMPurify` to parse and sanitize the HTML content: to strip out JS-related tags and attributes, and to make sure that the content is safe to render in the app.

But what I am truly proud of is that the code is **open source**, under the MIT license, and that anyone can read the code, contribute to it, or even deploy their own version of the app if they want to. I believe that open source is the way to go for projects like this, since it allows for more transparency, collaboration, and innovation.

Finally, a last touch, **images and styles are served from a proxy** that I implemented using Cloudflare Workers, so that they can be served without leaking the user's IP or other data to the original sites, and also to avoid mixed content issues when the original site is served over HTTP.

#### Some technical limitations

I found out that very large articles were causing long CPU usage and were reaching the Cloudflare Worker limits, so I had to implement a limit of `~300 KB` for the content so that it can be processed in a reasonable time. This means that some very long articles might not be rendered in the fallback method, but I think this is a reasonable trade-off to provide a good reading experience for most articles. This project is non-profit, so I don't want to deal with extra costs derived from longer CPU time, but I already experienced some sites that consistently reach this limit, so I might need to implement some extra optimizations in the future to be able to process larger articles without reaching the limits. (To be continued 🔜...)

## Sharing capabilities

Why a PWA? For me, one of the key features of the app is that it can be installed on your device, and you can **share** articles from your browser (or any other app) to _\[SAFE\]Reader_, so you can read them in a more comfortable way. This is particularly useful on mobile devices, where the cookie walls are more difficult to escape from.

I also added a share button so you can share the safe-reader version of the articles with your friends, so they can also read them.

## Philosophical thoughts

This app is important for me at a personal level, since I value strongly the idea of a free and open web, where everybody has the right to be informed and educated without having to pay for it, whether with money or with their personal data. I want to believe I am helping a handful of people to access information, and all actions that contribute to a more open and free web are worth it, even if they are small.

It resembles a symbol act of "tech anarchy", in the sense that it is a way to fight against the walled gardens and the data exploitation that many companies are taking part in, and to provide a tool that empowers users to take control of their own data.

## Is it legal?

With this tool, I am doing the same thing that a browser does when it loads a page in reading mode, or when it blocks third-party cookies. But I understand some publishers might not be happy about it, since they rely on the data collected from users to monetize their content.

However, I am not doing anything illegal, since I am **not bypassing any paywalls** or accessing any content that is behind a login, and I am not collecting any data from users. I am simply providing a way to read the content that is already publicly available on the Internet, in a more private and user-friendly way.

Despite that, I have a [FAQ section in the app](https://safe-reader.graficos.net/en/faq) to address some of these legal concerns, and I will be happy to discuss any legal issues that might arise with publishers or users. Reach me at [/contact](https://graficos.net/contact) if you want to talk about it.

## Disclaimer

Does your browser in your phone already support some sort of "reading mode"? Then you might not need this app. But in my experience, many mobile browsers do not provide a good reading mode, or they might still show the cookie walls, so I think this app can be useful.

The app is not perfect, and it might not work with all sites, especially those that have very aggressive anti-scraping measures, but I will do my best to improve it and make it work with as many sites as possible. If you find any issues or have any suggestions for improvement, please let me know.

Have you used the app and want to share your feedback? You can do it in the [GitHub repository](https://github.com/paulmelero/safe-reader), creaing an [issue](https://github.com/paulmelero/safe-reader/issues) and I will be happy to hear your thoughts and suggestions for improvement.

**References:**

[^grpr-deletion]: [European commission - Do we always have to delete personal data if a person asks?](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/dealing-citizens/do-we-always-have-delete-personal-data-if-person-asks_en)

[^access-right]: [AEPD - Right of access](https://www.aepd.es/en/rights-and-duties/know-your-rights/right-access)
