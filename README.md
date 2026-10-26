# Pair Programmer

A Claude Code plugin that turns Claude into a senior developer pairing with you. Claude explores the codebase, reads the documentation, suggests approaches and shows you how to debug and verify your work. You write every line of code.

It's built for developers who are new to a codebase and want to finish their tickets while learning how to work through them.

## How it works

You start by sharing a ticket, with screenshots if you have them. Claude restates the ticket and points out anything unclear. If the workspace has several parts, it asks which part of the app the ticket affects. Then it asks whether you want it to take the lead.

- **Yes**: Claude teaches. It walks you through where the code lives, how to debug the problem and how to check each step.
- **No**: you drive. Claude reviews your work and answers questions when you ask.

You can switch at any time by saying so.

Feature work is broken into small steps, each with a way to check that it works. Bug work starts by reproducing the bug, then testing a guess about the cause with the right tool, such as browser DevTools, breakpoints or logging, before fixing it.

Claude explains the why behind each suggestion and states review concerns directly. It doesn't quiz you or ask you to repeat things back.

When you're stuck, Claude starts with a light hint and gives stronger ones only if you need them. The hints go from the concept involved, to an existing example or documentation link, to a plain-English description of the logic, and finally to a before and after of the change.

If you ask Claude to just fix it, it will. It warns you briefly that skipping the investigation slows your growth, then shows you every change and where it goes. You paste the changes in yourself.

## What it enforces

- A hook blocks Claude from editing your project files. The only files it can write are its own notes in your project's `tmp/` folder, where it keeps the plan for the current ticket, and its memory files under `~/.claude/projects`.
- The pair programming output style switches on automatically while the plugin is enabled, and switches off when you disable the plugin.

## Requirements

- [Claude Code](https://code.claude.com/docs/en/quickstart)
- [Node.js](https://nodejs.org/), used by the hook that blocks edits

## Install

Add the marketplace, then install the plugin for just the project you want to pair on:

```bash
claude plugin marketplace add dmcleish91/pair-programmer
```

```bash
claude plugin install pair-programmer@dmcleish91-plugins --scope local
```

Run the install command from inside your project folder. Local scope switches the plugin on for that project only, so the rest of your Claude sessions behave normally.

In the desktop app, after adding the marketplace, click **+** next to the prompt box, choose **Plugins**, then **Add plugin**, and choose the scope for this project only.

## Turning it on and off

```bash
claude plugin disable pair-programmer@dmcleish91-plugins
```

```bash
claude plugin enable pair-programmer@dmcleish91-plugins
```

In the desktop app, use **+**, then **Plugins**, then **Manage plugins**.

## Updates

Automatic updates are off by default for personal marketplaces. To get the latest version, run:

```bash
claude plugin update pair-programmer@dmcleish91-plugins
```

## Developing the plugin

Load it for one session without installing:

```bash
claude --plugin-dir path/to/pair-programmer
```

Check the plugin and marketplace files:

```bash
claude plugin validate .
```

Raise `version` in `.claude-plugin/plugin.json` when you release changes.
