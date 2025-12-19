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

> ChurnLens helps you identify “hotspots” in your codebase by visualizing code churn directly in VS Code.

It highlights files that change frequently using churn levels (colors) and exposes a dedicated **Churn Explorer** sidebar so you can quickly spot volatile areas.

Some features I wanted from day one:

- **Churn Explorer**: A dedicated sidebar exploring churn with a tree view.
- **Context menu integration**: Right-click any file in the Churn Explorer to open its **Git history in GitHub**.
- **Configurable lookback**: Adjust the time window for churn calculation (default: 30 days).

It’s open source in the [Graficos GitHub org](https://github.com/graficos): [graficos/churnlens-extension](https://github.com/graficos/churnlens-extension).

Right now, the extension highlights files with colour coding and recent changes, but I’m planning to add more detailed churn insights soon. I’d love your feedback — let me know if you try it, find it useful, or have ideas for what to add next!
