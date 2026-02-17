---
lang: EN
title: 'How to Search for Emojis with Regular Expressions'
date: 2019-08-29
modifiedDate: 2026-02-17
thumbnail: /images/uploads/my-post.avif
tags:
  - js
  - regexp
  - emoji
description: 'How to look for emojis in a string using Javascript Regular Expressions with a handy shorthand.'
summary: 'How to look for emojis in a string using Javascript Regular Expressions with a handy shorthand.'
---

Turns out the documentation on MDN wasn't complete for this piece. But there is such a thing as [Unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes). And I was astonished when I found out there is a shorthand for Emojis in there!

I said it wasn't really complete because you need to pass the Unicode flag (`u`) in your `RegExp` for this to work.

Here's the code snippet.

```js
'Hey, there! 🌸'.match(/\p{Emoji}/u)
```

(Notice the `u` at the end.)

And this will be the output:

```js
["🌸", index: 12, input: "Hey, there! 🌸", groups: undefined]
```

The first element in the Array is the actual "match".

There are special cases, tho. **Skin tones** for example, as you may know, are a sum (or "ligature") of two characters [according to the unicode spec](https://www.unicode.org/reports/tr51/#Diversity): the **original emoji** plus a [modifier](https://en.wikipedia.org/wiki/Miscellaneous_Symbols_and_Pictographs#Emoji_modifiers):

```bash
> '👍🏾'.match(/\p{Emoji}/ug)
< (2) ["👍", "🏾"]
```

This case is a little bit trickier, because, you'll need to take into consideration also the modifiers:

- 🏻 U+1F3FB (`'\uD83C\uDFFB'` in JS): "Light" (types 1 or 2 in the _Fitzpatrick Scale_)
- 🏼 U+1F3FC (`'\uD83C\uDFFC'` in JS): "Medium-Light" (type 3)
- 🏽 U+1F3FD (`'\uD83C\uDFFD'` in JS): "Medium" (type 4)
- 🏾 U+1F3FE (`'\uD83C\uDFFE'` in JS): "Medium-Dark" (type 5)
- 🏿 U+1F3FF (`'\uD83C\uDFFF'` in JS): "Dark" (type 6)

To catch the modifiers, notice how I had to pass also the `g` flag to get "all" the emojis from the string (because Regexp in JS works that way, if the "global" flag is not passed it stops when the first match is reached).

This is way, way, handier than passing the Unicode characters range that Emoji covers as many libraries do, IMO, so it was worth sharing with you!

Happy emoji searching!
