---
title: ChurnLens — VS Code Extension
summary: A VS Code extension that helps you identify “hotspots” by visualizing code churn over a configurable time period.
description: ChurnLens is a VS Code extension that highlights frequently changing files, helping you spot potential instability and high-maintenance areas at a glance. It is open source.
tags: [open-source, vscode, vscode-extension, git, github, typescript]
yearCreated: 2025
url: https://github.com/graficos/churnlens-extension
repositoryUrl: https://github.com/graficos/churnlens-extension
license: MIT
---

> Elbaum, S., & Munson, J. C. (1998). *Code Churn: A Measure for Estimating the Impact of Code Change.* Proceedings of the International Conference on Software Maintenance (ICSM '98), Bethesda, MD, USA, pp. 24–31.

In that study, researchers found that **code churn** predicted defects better than the number of change requests, net code growth, or even the number of people involved. 

That finding is why I built **ChurnLens**: to bring that insight directly into VS Code and spot codebase hotspots before they turn into bugs.

## Churn VS Delta

The core idea behind the extension is that **how much a file changed** and **how much it grew** are fundamentally different questions:

> - **Delta** is net change (`added − deleted`). A file that loses 200 lines and gains 200 new ones has a delta of `0`. Delta says *"no change"*.
> - **Churn** is total movement (`|added + deleted|`). That same rewrite represents `400` lines of movement. 

Churn warns you more clearly about the number of changes. Removing code is about as dangerous as adding it, which is why ChurnLens ranks risk by **churn** by default.

## What ChurnLens Does

I wanted to see volatile areas and track how they move over time directly in the editor, without running separate scripts or leaving the workflow:

- **Hotspots at a glance**: Highlights files that change frequently using visual churn levels directly in your editor.
- **Churn Explorer**: A dedicated sidebar tree view starting from the workspace root, with context-menu shortcuts to file history on GitHub.
- **Trend panel**: Companion charts showing churn over time, additions vs. deletions, commit types, and a ranked risk breakdown.
- **Flexible inspection**: Switch between churn and delta, set date presets (2, 3, 7, 30 days, or custom), and group trends by SemVer tags, merge commits, or time buckets.
- **Fast by default**: The extension does not run in the background. It only computes the numbers when it's open/

It is open source in the [Graficos GitHub org](https://github.com/graficos): [graficos/churnlens-extension](https://github.com/graficos/churnlens-extension).

Try it out — I’d love your feedback and to hear what you’d want to see next!
