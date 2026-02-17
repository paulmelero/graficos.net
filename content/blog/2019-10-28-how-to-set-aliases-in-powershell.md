---
lang: EN
title: 'How to Set Aliases in PowerShell'
date: 2022-02-16
modifiedDate: 2026-02-17
thumbnail: /images/uploads/my-post-1-.avif
tags:
  - windows
  - scripting
description: 'How to set up custom aliases in Windows Powershell using profile.ps1 to run npm (node.js) commands using a shortcut'
summary: 'How to set up custom aliases in Windows Powershell using profile.ps1 to run npm (node.js) commands using a shortcut'
---

Let's enable user-defined aliases!

## 1. Enable scripting

First, we need to enable PowerShell scripting, because by default it's disabled. Within the PowerShell console, we will write (or copy/paste) this, and then press enter. (Nothing would show afterward)

```ps1
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

If you want to read more about execution policies, [go here](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6).

## 2. OK, now we need to write the aliases

There are different files where we can write the aliases. Those are the ["Profile files"](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_profiles?view=powershell-6#the-profile-files).

Depending on what users we want to allow these scripts to be accessed, we would choose a different source file. As for this case, it's just for me: the only user on my computer. I choose the global one:

Edit to `$PSHOME\Profile.ps1`.

- With `cd $PSHOME` you will navigate to the folder where the `Profile.ps1` file is in your CLI.
- You can also open the folder in the Files Explorer with `ii $PSHOME\` (`ii` is an alias itself for [`Invoke-Item`](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.management/invoke-item?view=powershell-6) in PowerShell).
- Whichever path you choose, you can then edit it with your favorite editor. I'm going to open it with VS Code. You can also do it all in one step by writing this in your CLI:

```bash
code $PSHOME\Profile.ps1
```

Within there, let's write a custom alias (adding these lines of code at the end of the file). In this case, I want an alias for `npm run dev` because I find myself writing that command all the time and I want to do it with fewer keystrokes. 🤷🏾‍♀️ _Developers..._

```ps1
function NpmDev {
  npm run dev
}
Set-Alias dev NpmDev
```

As you can see, the `Set-Alias dev NpmDev` is the important part.

- `Set-Alias` registers a new alias on the Profile and expects at least 2 arguments
- The first argument (in this case, `dev`) is my desired alias. Here you put anything you want.
- The second one `NpmDev` is the thing it's pointing to. It could be a **program**, a **file** location, another **alias**, a PowerShell **command** or, as in this case, a **`Function`**'s name.

You can write as many aliases as you want by appending more `Set-Alias` statements.

## 3. Save the file and restart your console

Then we need to save the `Profile.ps1` file and restart the console we are using (close and open it again).

Now I can type my alias `dev` in my console and it will be an alias for `npm run dev`.

I decided to use a function in PowerShell because that allows me to write aliases that can do more than one thing: on different lines, I could put more than one command. 😉

Happy aliasing!
