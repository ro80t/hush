# Working on this repo

This file is for an agent (or human) developing **hush itself** — not for a
project that has installed hush. If you're looking for the ruleset hush
enforces, read [`skills/hush/SKILL.md`](skills/hush/SKILL.md) instead.

## Single source of truth

`skills/hush/SKILL.md` is the only file you should hand-edit. Everything else
in this list is generated from it by `npm run sync` (`node scripts/sync-rules.mjs`)
and must not be hand-edited — your changes will be overwritten on the next sync:

- `GEMINI.md`, `.github/copilot-instructions.md`, `.windsurf/rules/hush.md`,
  `.clinerules/hush.md`, `.qoder/rules/hush.md`, `.agents/rules/hush.md`,
  `.cursor/rules/hush.mdc`, `.kiro/steering/hush.md` — the condensed ruleset
  (the block between `<!-- RULE-SUMMARY:START -->` and `<!-- RULE-SUMMARY:END -->`
  in `SKILL.md`), each with that tool's own frontmatter.
- `.claude/skills/hush/SKILL.md`, `.agents/skills/hush/SKILL.md` — full,
  byte-for-byte copies of `SKILL.md`, so this repo dogfoods its own skill when
  opened directly in Claude Code or another `.agents/skills/`-aware agent.

After editing `SKILL.md`:

```bash
npm run sync    # regenerate everything above
npm run check   # regenerate + fail if anything is still out of date (CI)
```

This file (`AGENTS.md`) and `CLAUDE.md` are hand-maintained and never touched
by the sync script.

## Why not symlinks

A symlink from, say, `AGENTS.md` to `SKILL.md` would drag SKILL.md's YAML
frontmatter and worked `## Examples` into a file that needs to stay plain
instructions, and it silently turns into a broken text file on a GitHub
"Download ZIP" or a Windows checkout without symlink support enabled. Generating
literal copies from one source avoids both problems at the cost of running one
script after an edit.

## Repo layout

See the [README](README.md#repo-layout) for the full file tree and what each
plugin manifest (`.claude-plugin/`, `.codex-plugin/`, `gemini-extension.json`)
is for.
