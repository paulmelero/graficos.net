---
lang: EN
title: 'How to filter GitHub issues other people made in your repository'
date: 2019-06-25
thumbnail: /images/uploads/carbon.png
tags:
  - tip
  - GitHub
description: 'How to filter an author from a pull request or an issue on GitHub using their syntax on the GitHub search.'
summary: 'How to filter an author from a pull request or an issue on GitHub using their syntax on the GitHub search.'
---

Actually, there are a lot of keywords and special [syntax](https://help.github.com/en/articles/understanding-the-search-syntax) you may use to filter your GitHub issues and pull requests, but this one seemed to be highly useful for me at one point and might be also for you. Also, if you are a maintainer of an OOS repository, you might want to filter all your issues or PRs out to see what is left.

And here it is: (Notice the - sign, which [means "exclusion"](https://help.github.com/en/articles/understanding-the-search-syntax#exclude-certain-results))

```plain
is:issue is:open -author:<YOUR_GITHUB_USER>
```

It is also "case insensitive", which means `-author:josh` is the same as `-author:Josh`.

This is the Documentation for the "exclusion" syntax:

- https://help.github.com/en/articles/understanding-the-search-syntax#exclude-certain-results

This is one of the references for filtering issues and PRs:

- https://help.github.com/en/articles/using-search-to-filter-issues-and-pull-requests

I hope this helps you to filter your issues and PRs on GitHub.
