#!/usr/bin/env node
// Two single sources of truth feed everything this script writes:
//   - skills/hush/SKILL.md → the rule-file copies and local skill-discovery copies below.
//   - package.json         → every plugin/marketplace manifest's name/version/description/
//                             license/keywords/author, plus the small per-tool extras
//                             under package.json#hushManifests. Edit those two files,
//                             then rerun this script — never hand-edit a generated file.
// A symlink can't do the SKILL.md job: it would drag SKILL.md's YAML frontmatter and
// worked Examples into files that must stay plain instructions. AGENTS.md and CLAUDE.md
// are NOT generated here — they're hand-maintained dev docs for people working on this
// repo, not distributed copies.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const skillPath = new URL("skills/hush/SKILL.md", root);
const source = readFileSync(skillPath, "utf8");

const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
const { name, version, description, license, keywords, author } = pkg;
const m = pkg.hushManifests;

const start = "<!-- RULE-SUMMARY:START -->";
const end = "<!-- RULE-SUMMARY:END -->";
const startIdx = source.indexOf(start);
const endIdx = source.indexOf(end);
if (startIdx === -1 || endIdx === -1) {
  throw new Error(`RULE-SUMMARY markers not found in ${skillPath}`);
}
const summary = source.slice(startIdx + start.length, endIdx).trim() + "\n";

function write(relPath, content) {
  const target = fileURLToPath(new URL(relPath, root));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  console.log(`wrote ${relPath}`);
}

function writeJson(relPath, obj) {
  write(relPath, JSON.stringify(obj, null, 2) + "\n");
}

// Condensed rule copies (ladder + naming + length rules, no frontmatter/examples).
write("GEMINI.md", summary);
write(".github/copilot-instructions.md", summary);
write(".windsurf/rules/hush.md", summary);
write(".clinerules/hush.md", summary);
write(".qoder/rules/hush.md", summary);
write(".agents/rules/hush.md", summary);

write(
  ".cursor/rules/hush.mdc",
  `---\ndescription: Hush, self-documenting code mode. Rename before commenting, minimal high-signal comments only.\nglobs:\nalwaysApply: true\n---\n\n${summary}`
);

write(
  ".kiro/steering/hush.md",
  `---\ntitle: Hush, self-documenting code mode\ninclusion: always\n---\n\n${summary}`
);

// Full SKILL.md copies for each tool's project-local skill auto-discovery, so
// opening this repo directly in that agent loads the real skill for dogfooding.
write(".claude/skills/hush/SKILL.md", source);
write(".agents/skills/hush/SKILL.md", source);

// Plugin/marketplace manifests — every field here traces back to package.json,
// so there's exactly one place to bump the version or reword the description.
writeJson(".claude-plugin/plugin.json", { name, version, description });

writeJson(".claude-plugin/marketplace.json", {
  $schema: m.claudeMarketplaceSchema,
  name,
  description,
  owner: { name: author.name },
  plugins: [{ name, description, source: "./", category: m.category }],
});

writeJson(".codex-plugin/plugin.json", {
  name,
  version,
  description,
  license,
  keywords,
  skills: m.codexSkillsPath,
});

writeJson(".codex-plugin/marketplace.json", {
  name,
  plugins: [
    {
      name,
      source: { source: "local", path: "./" },
      policy: { installation: m.codexInstallPolicy },
    },
  ],
});

writeJson("gemini-extension.json", {
  name,
  version,
  description,
  contextFileName: m.geminiContextFileName,
});
