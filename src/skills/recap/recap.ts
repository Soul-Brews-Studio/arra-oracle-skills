#!/usr/bin/env bun
// Fast recap - no AI, just git status
// Usage: bun recap.ts

import { $ } from "bun";
import { existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Get repo root
const root = (await $`git rev-parse --show-toplevel 2>/dev/null`.text()).trim() || process.cwd();
process.chdir(root);

// Gather git data
const branch = (await $`git branch --show-current`.text()).trim();
let ahead = "0";
try {
  ahead = (await $`git rev-list --count @{u}..HEAD 2>/dev/null`.text()).trim() || "0";
} catch {}
const lastCommit = (await $`git log --oneline -1`.text()).trim().slice(8, 68);

// Focus state
let focusState = "none";
let focusTask = "No active focus";
const focusFile = join(root, "ψ/inbox/focus-agent-main.md");
if (existsSync(focusFile)) {
  const focusContent = await Bun.file(focusFile).text();
  const stateMatch = focusContent.match(/^STATE:\s*(.+)/m);
  const taskMatch = focusContent.match(/^TASK:\s*(.+)/m);
  if (stateMatch) focusState = stateMatch[1].trim();
  if (taskMatch) focusTask = taskMatch[1].trim().slice(0, 80);
}

// Schedule (vault-first) — grab first event row from schedule.md
let schedule = "No schedule";
const vaultSchedule = join(homedir(), ".oracle", "ψ", "inbox", "schedule.md");
const scheduleFile = existsSync(vaultSchedule) ? vaultSchedule : join(root, "ψ/inbox/schedule.md");
if (existsSync(scheduleFile)) {
  const match = (await Bun.file(scheduleFile).text()).split('\n')
    .find(l => l.startsWith('| ') && !l.includes('---') && !l.includes('Date'));
  if (match) schedule = match.replace(/\|/g, '').trim().slice(0, 120);
}

// Latest retro and handoff
const monthDir = `ψ/memory/retrospectives/${new Date().toISOString().slice(0, 7)}`;
let latestRetro = "none";
let latestHandoff = "none";

try {
  const retros = (await $`ls -t ${monthDir}/*/*.md 2>/dev/null`.text()).trim().split('\n');
  const retro = retros.find(f => !f.includes('CLAUDE'));
  if (retro) latestRetro = retro.split('/').pop() || "none";
} catch {}

try {
  const handoffs = (await $`ls -t ψ/inbox/handoff/*.md 2>/dev/null`.text()).trim().split('\n');
  const handoff = handoffs.find(f => !f.includes('CLAUDE'));
  if (handoff) latestHandoff = handoff.split('/').pop() || "none";
} catch {}

// Git status
await $`git config core.quotePath false`.quiet();
const status = (await $`git status --porcelain`.text()).trim();
const lines = status ? status.split('\n') : [];

const modified = lines.filter(l => l.startsWith(' M'));
const untracked = lines.filter(l => l.startsWith('??'));

// Output
const now = new Date();
const time = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
const date = now.toLocaleDateString('en', { day: '2-digit', month: 'short', year: 'numeric' });

console.log("# RECAP");
console.log("");
console.log(`🕐 ${time} | ${date}`);
console.log("");
console.log("---");
console.log("");
console.log("## 🚧 FOCUS");
console.log(`\`${focusState}\` ${focusTask}`);
console.log("");
console.log("## 📅 TODAY");
console.log(schedule);
console.log("");
console.log(`## 📊 GIT: ${branch} (+${ahead} ahead)`);
console.log(`Last: ${lastCommit}`);
console.log("");

if (modified.length) {
  console.log(`**Modified** (${modified.length}):`);
  modified.forEach(l => console.log(`  ${l.slice(3)}`));
  console.log("");
}

if (untracked.length) {
  console.log(`**Untracked** (${untracked.length}):`);
  untracked.forEach(l => console.log(`  ${l.slice(3)}`));
  console.log("");
}

console.log("---");
console.log("");
console.log("## 📝 LAST SESSION");
console.log(`Retro: ${latestRetro}`);
console.log(`Handoff: ${latestHandoff}`);
