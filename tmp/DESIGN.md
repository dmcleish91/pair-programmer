# Pair Programmer Plugin: Design

## Goal

A Claude Code harness where the AI acts as a senior developer pairing with a junior who doesn't know the codebase. The senior explores code, reads documentation and suggests approaches. The junior writes every line. The work is built in small, verified steps so the junior learns how to work through this kind of task, not just the answer.

## Pieces

- `output-styles/senior-dev.md`: the behaviour. Marked `force-for-plugin: true`, so it switches on whenever the plugin is enabled.
- `hooks/hooks.json` + `scripts/guard-edits.js`: blocks Edit, Write, MultiEdit and NotebookEdit everywhere except `<project>/tmp/`.
- Packaged as a plugin so enabling the plugin turns both on and disabling turns both off. They can't drift apart.

## Workflow

1. Developer shares the ticket and screenshots. Senior restates it and flags unclear parts of the ticket.
2. Senior checks the workspace layout. If it has several parts, asks whether the developer knows which part and screen. Single project skips this.
3. Senior asks "Do you want me to take the lead on this?" Yes means teacher. No means assistant. Developer can switch anytime.
4. Senior explores and gives a short tour: files, types, data flow, similar existing code, official doc links.
5. Feature route: one or two approaches with a recommendation, developer explains the choice back, small steps each with a "how you'll know it works" check, plan saved in `tmp/`.
6. Bug route: reproduce, hypothesis, pick the tool (DevTools, breakpoints, logging, tests), confirm cause, fix, confirm the reproduction passes. If the ticket names the cause, skip the hunt and confirm. If the cause is complex, point at the next concrete move instead of stating it.
7. Build loop: developer writes a step and runs its check, senior reads the file and output and reviews with questions.
8. Wrap-up: what changed, techniques used, what carries over to the next ticket.

## Code-in-chat line

Allowed: real type and method names, links to existing code in the project, short excerpts of existing code, official documentation links, plain-English description of logic.
Last resort only: a before and after of the exact change for the developer to paste, when lighter hints haven't worked or the developer asks.
"Just fix it": a short warning that skipping the investigation slows their growth, then before and after for every change in every file with where each goes, then how to verify. The developer pastes it in. The tool can't stop misuse, so it informs rather than refuses.
Never: edits to project files, files written through shell commands.

## Hint ladder

Question, then concept, then existing example or doc link, then plain-English logic, then before and after.

## Decisions and why

- Plugin rather than standalone style + settings hook: hook input doesn't include the active output style, so a standalone hook can't tell when pair mode is on. In a plugin, the style's `force-for-plugin` ties both to the plugin's enabled state.
- Hook only covers file editing tools. Shell writes are covered by the output style's instructions, since reliably parsing shell commands for writes is hard. Watch for shell writes during testing.
- Hook uses exec form (`node` + `args`) so it runs the same on Windows and macOS with no shell quoting.
- `keep-coding-instructions` is left off. The built-in coding instructions push Claude to implement and verify changes itself, which fights the senior role.

## Things to watch while testing

- Does the style apply in the desktop app as well as the terminal?
- Does Claude ever try to write project files through Bash or PowerShell?
- Hook blocks all writes outside `<project>/tmp/`, including Claude's memory files in `~/.claude`. Decide whether memory writes should be allowed.
- Hook fails open: if the script crashes, the edit goes through. `guard-edits.js` is small enough that this should not happen, but check the debug log if an edit slips past.
- Does the senior keep to one step at a time, or drift into giving the whole plan's code?

## Testing

Validate: `claude plugin validate .`
Run against a real project: from that project's folder, `claude --plugin-dir <path to this repo>`.
After editing plugin files mid-session: `/reload-plugins`.
