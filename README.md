# Hush

An [Agent Skill](https://github.com/vercel-labs/skills) that enforces self-documenting naming and minimal, high-signal comments in AI-generated and AI-edited code.

## What it does

- Prefers a rename over a comment whenever a name alone can carry the meaning.
- Caps ordinary comments at ~3 lines, breaking lines at clause boundaries — clarity of the break outranks the line count.
- Writes full doc comments with usage examples for public/exported API surfaces (library boundaries), with no length cap there.
- Always comments non-obvious behavior — invariants, workarounds, gotchas — regardless of public/private visibility.
- Comments a branch (`if`/`for`/`while`/`switch`) only when its condition or body can't be inferred from the names involved.

See [`skills/hush/SKILL.md`](skills/hush/SKILL.md) for the full ruleset.

## Install

With the [skills CLI](https://github.com/vercel-labs/skills) (`npx skills`):

```bash
npx skills add <owner>/hush
```

Update later with:

```bash
npx skills update hush
```

This installs `skills/hush/SKILL.md` into the right directory for your agent (`.claude/skills/`, `~/.codex/skills/`, `.cursor/rules/`, etc.) — the skill file itself is agent-agnostic.

### Claude Code plugin marketplace

This repo is also a valid Claude Code plugin (`.claude-plugin/plugin.json` at the root). Add it as a marketplace source, or install directly:

```bash
/plugin marketplace add <owner>/hush
/plugin install hush
```

### Manual install

Copy `skills/hush/` into whichever directory your agent scans for skills (e.g. `~/.claude/skills/hush/`, `~/.codex/skills/hush/`).

## Repo layout

```tree
hush/
  skills/
    hush/
      SKILL.md          # the skill — name + description frontmatter, then the ruleset
  .claude-plugin/
    plugin.json          # Claude Code plugin manifest
  README.md
```

Adding a sibling skill later (e.g. a `hush-review` that audits an existing diff for comment-noise) just means a new `skills/<name>/SKILL.md` directory — no other changes needed.

## License

MIT — see [`LICENSE`](LICENSE).
