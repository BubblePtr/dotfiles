#!/usr/bin/env node
// Minimal Claude Code statusline: model | context bar | project git | 5h/7d usage.
// Reads the statusLine stdin JSON; no plugin, no deps, no nerd-font glyphs.
// Runtime-agnostic: runs under node or bun (no Bun-only APIs).
import { execSync } from "node:child_process";

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BLUE = "\x1b[94m";
const GRAY = "\x1b[38;5;245m";
const c = (color, s) => `${color}${s}${RESET}`;

let data = {};
try {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
} catch {}

const parts = [];

// Model (+ reasoning effort, when the model exposes one)
const model = data.model?.display_name ?? data.model?.id;
if (model) {
  const effort = data.effort?.level;
  parts.push(
    effort
      ? c(CYAN, `[${model}`) + c(GRAY, ` ${effort}`) + c(CYAN, "]")
      : c(CYAN, `[${model}]`),
  );
}

// Context bar (native percentage on CC v2.1.6+, else derive from token counts)
const cw = data.context_window ?? {};
let ctxPct = cw.used_percentage;
if (ctxPct == null && cw.current_usage && cw.context_window_size) {
  const u = cw.current_usage;
  const used =
    (u.input_tokens ?? 0) +
    (u.cache_creation_input_tokens ?? 0) +
    (u.cache_read_input_tokens ?? 0) +
    (u.output_tokens ?? 0);
  ctxPct = (used / cw.context_window_size) * 100;
}
if (ctxPct != null) {
  const pct = Math.min(100, Math.max(0, Math.round(ctxPct)));
  const filled = Math.round(pct / 10);
  const color = pct >= 85 ? RED : pct >= 70 ? YELLOW : GREEN;
  parts.push(c(color, "█".repeat(filled) + "░".repeat(10 - filled) + ` ${pct}%`));
}

// Project + git branch
const dir = data.workspace?.current_dir ?? data.cwd;
if (dir) {
  let seg = c(YELLOW, dir.split("/").pop());
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: dir, stdio: ["ignore", "pipe", "ignore"], timeout: 1500,
    }).toString().trim();
    if (branch) {
      const dirty = execSync("git status --porcelain --untracked-files=no", {
        cwd: dir, stdio: ["ignore", "pipe", "ignore"], timeout: 1500,
      }).toString().trim() ? "*" : "";
      seg += ` git:(${c(CYAN, branch + dirty)})`;
    }
  } catch {}
  parts.push(seg);
}

// Usage limits: 5h always, 7d only when it gets tight
const fmtReset = (at) => {
  if (!at) return "";
  const ts = typeof at === "string" ? Date.parse(at) : at > 1e12 ? at : at * 1000;
  const mins = Math.max(0, Math.round((ts - Date.now()) / 60000));
  return mins >= 60 ? ` (${Math.floor(mins / 60)}h${mins % 60}m)` : ` (${mins}m)`;
};
const usageColor = (p) => (p >= 90 ? RED : p >= 75 ? YELLOW : BLUE);
const fh = data.rate_limits?.five_hour;
if (fh?.used_percentage != null) {
  const p = Math.round(fh.used_percentage);
  parts.push(c(usageColor(p), `5h: ${p}%`) + c(GRAY, fmtReset(fh.resets_at)));
}
const sd = data.rate_limits?.seven_day;
if (sd?.used_percentage != null && sd.used_percentage >= 80) {
  const p = Math.round(sd.used_percentage);
  parts.push(c(usageColor(p), `7d: ${p}%`) + c(GRAY, fmtReset(sd.resets_at)));
}

console.log(parts.join(c(GRAY, " | ")));
