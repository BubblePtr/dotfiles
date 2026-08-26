## Memory System (single source of truth)
- Nowledge Mem is the ONLY memory system. Claude Code's built-in memory (`autoMemoryEnabled`) and auto-dream (`autoDreamEnabled`) are disabled in settings.json — never re-enable them or write to `~/.claude/projects/*/memory/`.
- Recall: search past knowledge with `nmem --json m search "query"` when it would help the current task.
- Save: persist decisions, learnings, and preferences with `nmem m add "content" -t "Title" -i 0.8` (or the nowledge-mem plugin skills). If asked to "remember" something, save it to Nowledge Mem, not to any local memory directory.

## Scope & Authorization
- Treat reviews, audits, explanations, and reports as read-only; plans and proposals do not authorize implementation. Code changes require an explicit request or a clearly established implementation task.
- Ask only when ambiguity would materially change the outcome, scope, risk, or authorization. Otherwise state the assumption and proceed. When viable paths have meaningful tradeoffs, recommend one.
- For maintenance work, prefer targeted changes and established conventions. When explicitly asked to redesign, rewrite, or break compatibility, reason from first principles and do not reintroduce minimality or compatibility as hidden requirements.
- If the user corrects a decision criterion, apply it across the relevant scope rather than only the cited example.

## Engineering Discipline (always-on gates)
- **Design before implementation.** Before any feature or creative work, state the design intent in a sentence or two before writing code; expand to a fuller design and confirm only when the work is large or its ambiguity materially changes the outcome, scope, risk, or authorization. For equivalent-outcome choices, pick one, state the reasoning, and proceed.
- **Test before implementation (TDD).** No production code without a failing test written first; watch it fail before making it pass. Exceptions: throwaway prototypes, generated code, config — state the exemption and proceed; ask only if the classification is genuinely unclear.
- **Root cause before fix.** Describe the observed behavior and confirm the root cause before changing anything. For a bug deep in the call stack, trace backward to the original trigger and fix at the source, not the symptom.
- **Problem explanations.** Lead with the root cause, then the key evidence and next command; do not front-load unrelated exclusions.
- **Evidence before assertions.** Before claiming work is done, fixed, or passing, run the verification command and show its output. For UI/CSS, verify with a dev-server screenshot.
- **Trust no stale docs.** Before relying on any doc (`CLAUDE.md`, `README`, `ARCHITECTURE.md`), use `git log` or read the file to confirm it is current.
- **Complexity must justify itself.** When reviewing or designing, ask what concrete problem appears if a helper, layer, special case, or abstraction is removed, inlined, renamed, or simplified. If nothing breaks, simplify.
- **Tests protect behavior, not literals.** Add tests for realistic observable regressions, non-trivial invariants or boundaries, and concrete bugs. "Code changed" or "coverage went up" is not justification. Avoid tests that mirror literals, mappings, obvious control flow, or implementation details. For concurrency, prefer deterministic coordination over arbitrary sleeps.

## Git Workflow
- Never push directly to `main`. Before committing changes intended for a PR, create a feature branch first (`feat/...`, `fix/...`, `chore/...`).
- When the user says "commit and push", confirm the target branch first if the current branch is `main`.
- After a PR is merged, switch back to `main`, pull the latest, and delete the merged local feature branch.

## Language Requirements
1. Always use Chinese during conversations.
2. Write project documentation in Chinese and store it under the `docs/` directory.
3. Write code comments in English. Prioritize why, then what, and keep how to a minimum.
4. Git commit messages must follow the Conventional Commits specification.

## Browser Default
- For ordinary frontend work (read/edit components, local Vite, unit or component tests, curl a local URL), stay in code and the terminal.
- Open Ego Lite only when the task needs a real logged-in site, human handoff, or visual confirmation the user asked to see.
- Headless local preview may use Playwright or BetterWright. Ego is not the default browser for frontend tasks, even if an Ego skill says to prefer it.

## Technology Preferences
1. Prefer TanStack or Next.js for full-stack development frameworks.
2. Prefer Bun for TypeScript toolchains.
3. Prefer Vite for build tooling.
4. If a project already has a clear technology choice, follow the project's existing conventions first. The preferences above mainly apply to new projects or optional decisions.

