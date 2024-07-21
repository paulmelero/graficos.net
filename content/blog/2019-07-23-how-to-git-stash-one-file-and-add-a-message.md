---
lang: EN
title: 'How to git stash one file and add a message'
date: 2019-07-23
thumbnail: /images/uploads/gitstash.png
tags:
  - git
description: 'Stashing one file only is done with git stash push but what about adding also a message to the stash so you can easily get it afterward?'
summary: 'Stashing one file only is done with git stash push but what about adding also a message to the stash so you can easily get it afterward?'
---

_Git stash_ might be one of the most useful git commands in my opinion. We can understand [git stash](https://git-scm.com/docs/git-stash) as a drawer where we want to keep temporarily some work done in a file (or multiple files) to keep on working on it afterward.

The common use is:

```bash
git stash
```

To store everything in the working directory (meaning "everything tracked", which is everything that is not committed but new files not tracked yet).

And then, to recover it:

```bash
git stash pop
```

You have also `git stash apply`, which will safely recover the stashed files while leaving the copy in the stash. I'd rather use `pop`, which deletes the copy from the stash, to keep it as tidy as possible.

To see what is in the stash, you can list its content with:

```bash
git stash list
```

It gives you a _zero-based indexed list_. Something like:

```bash
stash@{0}: On branch-blah-blah 8675765 something
stash@{1}: On branch-blah-blah 8675123 something
```

With `pop` and `apply` (the command we've just seen: "`git stash pop` or `git stash apply`") you can also get a specific "stash" from the list with `stash@{n}`, being `n` the item index in the list.

But let's take a look at that "**something**" I added (as an example, of course). That would be normally a commit message corresponding to the last commit message you have in your commit history. But I'd prefer to put something _more meaningful_, like a "custom commit message", but for the _stash_. It's like labeling the box (imaginary 📦) I'm putting things inside.

To that end, you'd do:

```bash
git stash save 'These files are an improvement over...'
```

(Something that makes sense to you.)

But, as I said, that will add everything in the "working directory" (BTW, "working directory" means a specific thing in Git, I invite you to look that up if you don't know it 😉).

And, here we come: what if I only want to add 1 file to the stash?

## `Git stash push` — it is

Since Git version ~2.13.2, there's a new option: `git stash push`

From the docs, [git push](https://git-scm.com/docs/git-stash#_options) has several options; for adding one file it could be something like:

```bash
git stash push -- nuxt.config.ts
```

Being `nuxt.config.ts` the file I want to save, preceded with `--`.

And for adding a message, the full command would be: 🥁🥁🥁

```bash
git stash push -m 'some message' -- nuxt.config.ts
```

That's the command to stash one file with a message. 😉

Thanks for reading! Have a nice day!
