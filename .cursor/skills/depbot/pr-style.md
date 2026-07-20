# PR style

## When to open a PR

Only when the user asked to open / create a PR (or clearly said “ship it”), or when
running in **scheduled ship** mode.

For plan-only / dry-run: report and stop — no branch required.

For recurring runs, follow **`pr-lifecycle.md` first** (find/reuse daily PR, noop if
unchanged, update-in-place if delta). This file covers title/body/commit shape.

## Git hygiene

1. `git status` / `git diff` — only intended files.
2. Branch per track: daily → `deps/depbot`; high-risk → `deps/depbot-<topic>` (`pr-lifecycle.md`).
3. Stage relevant files; commit with a clear message (new commit when updating an existing PR).
4. Push and `gh pr create` **or** update the existing PR body; add label `depbot`.

Do not amend published history. Do not force-push. Do not use `git clean` / `reset --hard`.

## Branch naming

- Daily track: `deps/depbot` (preferred for scheduled runs)
- One-off / high-risk: `deps/depbot-vite`, `deps/pnpm-<topic>`, `deps/cargo-<topic>`, `deps/tauri-stack-<version>`

## Commit message

Imperative and specific: `Bump catalog react to 19.2.x` or `Bump tauri stack to 2.12`.
When refreshing a daily PR: `deps(depbot): refresh daily batch (<date>)`.

## PR title

One line: what + scope. Examples:

- `deps(depbot): daily catalog + cargo patches`
- `deps(pnpm): catalog patch updates (lint toolchain)`
- `deps(cargo): bump serde and serde_json`
- `deps(tauri): align api/cli/crates to 2.12`

## PR body

```markdown
## Summary
- What and why (security / routine / unlock / requested major).

## PR lifecycle
- Track: daily (`deps/depbot`) / high-risk (…)
- Action: created | updated | noop

## Dependency comments
- Quotes / hold status.

## Coupled bundles
- Bundle id, members, unlock status, single action.

## Node toolchain
- Consistent Node 24, or **Node toolchain violations (FORBIDDEN)** table on drift.
  Depbot does not bump Node.

## Quarantine
- Candidates skipped because younger than 2 days.
- **Quarantine violations (FORBIDDEN):** current pins still younger than 2 days + proposed rollback.

## Changes
- `name` `old -> new` (group if long).
- Code/config migration touches (short list), if any.

## Verify & migrate
- Commands run and results.
- Fix rounds used; rolled back packages (or none).

## Risk
- Low / medium / high; link release notes for majors.

## Test plan
- [ ] Commands you ran (from verify ladder) and results
- [ ] Anything skipped (and why)

## Notes
- Backlog / unmet unlocks / needs-human migration
```

## After opening / updating

Paste the PR URL in the final answer. On **noop (up to date)**, print the existing PR URL
and `noop — PR #n already up to date`.
