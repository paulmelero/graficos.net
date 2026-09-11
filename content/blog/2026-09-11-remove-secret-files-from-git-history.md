---
lang: EN
title: 'How to Remove a Committed Secret File from Git History'
date: 2026-09-11
thumbnail: /images/uploads/remove-secret-files-from-git-history.avif
tags:
  - git
  - GitHub
  - tip
  - cli
  - security
description: 'A secret got committed and pushed. Rewrite the history with git-filter-repo or an interactive rebase, then force-push — and rotate the secret first.'
summary: 'A secret got committed and pushed. Rewrite the history with git-filter-repo or an interactive rebase, then force-push — and rotate the secret first.'
---

ℹ️ **Note:** the commands below use `.env` as the example secret file. Replace it with the actual path of the file you committed (e.g. `credentials.json`, `config/secrets.yml`).

So you committed a `.env` (or `credentials.json`, or a password or API key) and pushed it. Deleting the file in a new commit does **not** remove it from Git — it is still in every earlier commit, and anyone who cloned already has it.

⚠️ **First: rotate the secret.** Once it is pushed, treat it as compromised. Rewriting history cleans up the traces, but it is not a substitute for rotating the secret. If the secret is live, revoke it _before_ you touch Git. This is the real fix. But sometimes, it's not a secret you can rotate, and you just want to remove the traces from Git history.

Then rewrite the history locally, then force-push.

## The lazy way: `git filter-repo`

For a file that appears across many commits, `git filter-repo` is the right tool:

```bash
git filter-repo --force --invert-paths --path .env
```

- `--invert-paths` keeps everything **except** the given path.
- `--force` is needed because you are not running it on a fresh clone.
- Add more `--path` flags to remove several files.

It rewrites all commits and drops the file from every one of them. Note that `--force` also removes the `origin` remote, so add it back before pushing:

```bash
git remote add origin <REMOTE_URL>
git push --force --all
git push --force --tags
```

## GitHub's recommendation

GitHub recommends running filter-repo with its dedicated sensitive-data flag, which fetches all refs and prints the extra steps needed to clean up other copies:

```bash
brew install git-filter-repo
```

Then run this **on a fresh clone** — otherwise it refuses unless you add `--force`:

```bash
git-filter-repo --sensitive-data-removal --invert-paths --path .env
```

Unlike plain `--force`, `--sensitive-data-removal` keeps the `origin` remote, so you can overwrite branches, tags and refs in one go:

```bash
git push --force --mirror origin
```

That push fails on `refs/pull/*` (read-only on GitHub) by design. To purge the objects from GitHub's servers you must open a ticket at the [GitHub Support portal](https://support.github.com/) — there is no API or `gh` command for it. Support only does this for sensitive data that rotation can't mitigate, and it cannot reach forks.

See [Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## The manual way: interactive rebase

If the secret is only in **one** commit, a rebase could be enough:

```bash
git rebase -i HEAD~3        # open the last 3 commits, pick the offending one
```

Mark that commit as `edit`, then:

```bash
git rm --cached .env # or the file you want to remove
git commit --amend --no-edit
git rebase --continue
```

This rewrites that commit without the file. Force-push as above.

## ⚠️ Don't rely on `git rm`

`git rm .env` (or `git rm --cached .env`) only changes what is tracked **from now on**. The blob stays in every earlier commit: `git log --all -- .env` still finds it, and `git show <old-commit>:.env` still prints the secret.

It is only enough if:

- the secret was **never committed**, or
- it's in the **last commit and you haven't pushed**: then `git rm --cached .env` + `git commit --amend` fixes that one commit.

Once it's been pushed, `rm` in any form is useless — you need the rebase above or `git filter-repo`, plus rotation.

## What about `git history`?

Git 2.54 (2026) added `git history`, an experimental rewrite command that works without touching the worktree (except `fixup`, which reads staged changes) and automatically updates descendant branches. Git 2.55 added a third subcommand: **`fixup`**. It applies your **currently staged changes** to an earlier commit — like `git commit --fixup` followed by `git rebase --autosquash`, but in one step:

```bash
git rm --cached .env
git history fixup <commit>      # the commit that added .env
```

By default it drops commits that become empty and updates all descendant branches. `--reedit-message` lets you edit the target's message; `--empty=drop|keep|abort` controls what happens to emptied commits.

⚠️ **`fixup` only touches the one commit you point it at.** If the secret appears in several commits, `git filter-repo` is still the right tool. It also doesn't work on histories with merges, and it aborts on conflicts. (`reword` and `split` round out the command set.)

## After the force-push

- If it was on GitHub/GitLab, the old commits can still be reachable in forks and cached views. Forks keep them alive indefinitely, and GitHub only purges cached views through a support ticket.

## Other contributors might have gotten the secret in their clones

- They should reclone the repository after you force-push. But normally this is difficult to enforce.
- If that's not an option, make them follow these steps:

```bash
# delete all local tags
git tag -l | xargs git tag -d
# remove stale remote-tracking refs and fetch the rewritten tags
git fetch --prune --tags
# rebase the current branch onto the new remote main branch
git rebase origin/main  # or whichever branch is your main one
# drop all reflog entries, including stash entries
git reflog expire --expire=now --all
# run GC to remove dangling objects
git gc --prune=now

# finally, verify the first changed commit is gone:
git cat-file -t ${HASH_OF_FIRST_CHANGED_COMMIT}
# a fatal error means it's gone; if it prints "commit", it's still there
```

## Good practices

- Add the file to `.gitignore` so it never comes back.
- Use a secret manager or environment variables instead of committing secrets in files.
- If you find it necessary, create a `pre-commit` hook to check for sensitive data before it is committed, or a `pre-push` hook before it is pushed.
- If you are using GitHub, enable [secret scanning](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning) to detect secrets in your repository.