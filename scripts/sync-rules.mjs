#!/usr/bin/env node
// Single source of truth is skills/hush/SKILL.md. Everything below is generated
// from the block between RULE-SUMMARY:START/END — edit SKILL.md, then rerun
// this script. A symlink can't do this job: it would drag SKILL.md's YAML
// frontmatter and worked Examples into files that must stay plain instructions.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const skillPath = new URL("skills/hush/SKILL.md", root);
const source = readFileSync(skillPath, "utf8");

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

write("AGENTS.md", summary);
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
