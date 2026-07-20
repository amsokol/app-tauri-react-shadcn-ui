# PR style

## When to open a PR

Only when the user asked to open / create a PR (or clearly said “ship it”).
For plan-only / dry-run: report and stop — no branch required.

## Git hygiene

1. `git status` / `git diff` — only intended files.
2. Branch: `deps/<short-topic>` or `depbot/<short-topic>`.
3. Stage relevant files; commit with a clear message.
4. Push and `gh pr create` if authenticated.

Do not amend published history. Do not force-push. Do not use `git clean` / `reset --hard`.

## Branch naming

- `deps/pnpm-<topic>`
- `deps/cargo-<topic>`
- `deps/tauri-stack-<version>`

## Commit message

Imperative and specific: `Bump catalog react to 19.2.x` or `Bump tauri stack to 2.12`.

## PR title

One line: what + scope. Examples:

- `deps(pnpm): catalog patch updates (lint toolchain)`
- `deps(cargo): bump serde and serde_json`
- `deps(tauri): align api/cli/crates to 2.12`

## PR body

```markdown
## Summary
- What and why (security / routine / unlock / requested major).

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

## Risk
- Low / medium / high; link release notes for majors.

## Test plan
- [ ] Commands run and results
- [ ] Anything skipped (and why)

## Notes
- Backlog / unmet unlocks
```

## After opening

Paste the PR URL in the final answer.
