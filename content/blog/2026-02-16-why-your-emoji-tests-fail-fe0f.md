---
lang: EN
title: "The Tiny Unicode Gotcha Behind Your Emoji Tests Failing: U+FE0F"
date: 2026-02-16
thumbnail: /images/uploads/ufeof.avif
tags:
  - Unicode
  - Emoji
  - JavaScript
  - TypeScript
  - Vitest
  - Testing
description: "A tiny Unicode detail can break your tests: `☕` and `☕️` look the same but are different strings because of the "Variation Selector-16" (`U+FE0F`). This post explains why it happens and how to avoid flaky assertions."
summary: "A tiny Unicode detail can break your tests: `☕` and `☕️` look the same but are different strings because of the Variation Selector-16 (`U+FE0F`). This post explains why it happens and how to avoid flaky assertions."
---

I had one of those "this makes no sense" test failures today 😡:

```text
- Expected: `☕☕`
- Received: `☕️☕️`
```

Both looked identical in my editor a few months ago, but they are different Unicode sequences and I see them differently now (different font, or different VS Code settings?):

- `☕` -> `U+2615`
- `☕️` -> `U+2615 U+FE0F`

That extra `U+FE0F` is **Variation Selector-16**, which requests emoji presentation. In visual terms, they often look the same. In string comparison terms, they are not equal.

Now I understand **why in the emoji picker we can select the "same emoji" in different styles**... 🤯

## What Is `U+FE0F`?

`U+FE0F` is **Variation Selector-16** (VS16).

Its purpose is simple:

> It forces a character to render in emoji presentation instead of text presentation.

Many Unicode characters — like hearts, airplanes, or check marks — can be displayed either:

- As plain text (monochrome, typographic style)

- As colorful emoji

`U+FE0F` tells the renderer: "Make this the emoji version."

A Concrete Example. Take the red heart. Base character `U+2764` (❤):

```
U+2764  (❤)
```

Depending on the platform, this might render as a simple black heart. Now add `U+FE0F`:

```
U+2764 U+FE0F  →  ❤️
```

They look almost identical (depending on the font, the OS, the program running it, etc.).

But they are different strings:

- `❤` -> `U+2764`
- `❤️` -> `U+2764 U+FE0F`

This is why your tests fail.

```ts
'❤' !== '❤️'
```

Go ahead, test it in the console:

```ts
'❤' !== '❤️'
console.log('\u2764') // "❤"
// Emoji version:
console.log('\u2764\uFE0F') // "❤️"
// Or with "code point escape" syntax:
console.log('\u{2764}\u{FE0F}') // "❤️"
```

## Other Examples

Here are some examples of characters that can be displayed as both text and emoji:

- ✈ / ✈️ (airplane)
- ⌚ / ⌚️ (watch)
- ⌛ / ⌛️ (hourglass)
- ☎ / ☎️ (telephone)
- ✉ / ✉️ (envelope)
- ✂ / ✂️ (scissors)
- ☀ / ☀️ (sun)
- ☁ / ☁️ (cloud)
- ☔ / ☔️ (umbrella)
- ☕ / ☕️ (coffee)
- ⚽ / ⚽️ (soccer ball)
- ⭐ / ⭐️ (star)
- ♥ / ♥️ (heart suit)
- ♠ / ♠️ (spade suit)
- ♣ / ♣️ (club suit)
- ♦ / ♦️ (diamond suit)
- ⚠ / ⚠️ (warning sign)

Two more important ones:

- `©`, `®`, `™` can also take `U+FE0F` (`©️`, `®️`, `™️`) depending on platform/font behavior.
- Keycaps are sequences too, like `1️⃣` = `1` + `U+FE0F` + `combining keycap mark`.

> Note: these are not the only characters that can be displayed as both text and emoji. There are many more. Also, if you see them displayed equally, it's not necessarily because they are the same character. It's because the font or the platform is displaying them that way.

## How to Detect It

Log the code points:

```ts
;[...str].map((c) => c.codePointAt(0).toString(16))
```

You'll see something like:

```ts
;['2764', 'fe0f']
```

That `fe0f` is the hidden culprit.

Go ahead, test something like this in the console:

## How to Fix It

You've got options:

- If you compare user input, normalize first. Normalize your strings (if appropriate for your use case)

- Ensure both sides use the same literal

- Strip variation selectors if emoji presentation doesn't matter

- Be explicit in tests about which form you expect. Pick one representation and stick to it project-wide.

For example, to remove variation selectors:

```ts
str.replace(/\uFE0F/g, '')
```

## Does the opposite exist?

Yes, there is a variation selector for text presentation. It's `U+FE0E`.

`U+FE0E` is **Variation Selector-15** (VS15). It forces a character to render in text presentation instead of emoji presentation (no colors, only text/typographic style).

```
U+2764 U+FE0E  →  ❤
```

Try it in the console:

```ts
console.log('\u2764\uFE0E') // "❤"
```

You'll see it renders as a simple black heart.

## Conclusion

This is a tiny Unicode detail that can break your tests. But it also taught me a little bit about Unicode and how it works.

> This is the key to understanding how Unicode handles both iconography and typography.

In summary, you will understand perfectly the different looking of emojis and text by looking at this table taken from the [Emoji wikipedia page](https://en.wikipedia.org/wiki/Emoji#Emoji_versus_text_presentation):

<!-- prettier-ignore -->
| U+ | 2139 | 231B | 26A0 | 2712 | 2764 | 1F004 | 1F21A |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Default presentation | Text | Emoji | Text | Text | Text | Emoji | Emoji |
| Base code point | ℹ | ⌛ | ⚠ | ✒ | ❤ | 🀄 | 🈚 |
| Base+VS15 (text) | ℹ︎ | ⌛︎ | ⚠︎ | ✒︎ | ❤︎ | 🀄︎ | 🈚︎ |
| Base+VS16 (emoji) | ℹ️ | ⌛️ | ⚠️ | ✒️ | ❤️ | 🀄️ | 🈚️ |
| Twemoji image | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Twemoji2_2139.svg/40px-Twemoji2_2139.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Twemoji2_231b.svg/40px-Twemoji2_231b.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Twemoji2_26a0.svg/40px-Twemoji2_26a0.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Twemoji2_2712.svg/40px-Twemoji2_2712.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Twemoji2_2764.svg/40px-Twemoji2_2764.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Twemoji2_1f004.svg/40px-Twemoji2_1f004.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Twemoji2_1f21a.svg/40px-Twemoji2_1f21a.svg.png) |

It's wild how one invisible code point decides which side you're on. I'm glad I learned something new today!

## ⚠️ Security Considerations ⚠

`U+FE0F` (Variation Selector-16) and `U+FE0E` (Variation Selector-15) are considered hidden characters and some security scanners could flag them as potential security vulnerabilities. This is because some characters have been used for malicious purposes, like the ["LLMS ASCII Smuggling" attacks with zero-width characters](https://www.firetail.ai/blog/ghosts-in-the-machine-ascii-smuggling-across-various-llms).

So, yes, be careful of what you copy and paste from the Internet before pasting it in your code, your console, or your AI chat. 🙃
