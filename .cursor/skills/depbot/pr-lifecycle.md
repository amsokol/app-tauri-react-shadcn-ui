# PR lifecycle (daily / recurring runs)

Depbot may run on a schedule (e.g. daily). Runs must be **idempotent**: one open
PR per track, no empty pushes, no duplicate PRs.

## Tracks

| Track | Branch | Label | Typical contents |
|-------|--------|-------|------------------|
| **daily** | `deps/depbot` | `depbot` | Low-risk pnpm patches, cleared bundles (e.g. tailwind), eligible Cargo patches |
| **high-risk** (optional separate) | `deps/depbot-<topic>` e.g. `deps/depbot-vite` | `depbot` + topic | Vite / Tauri / React majors — **not** mixed into daily |

Default scheduled run uses the **daily** track only unless the user asks otherwise.

Identify an existing PR by: open state + label `depbot` + head branch matching the track
(prefer `gh pr list --label depbot --state open` and filter by branch).

## Algorithm (each run that is allowed to open/update PRs)

1. Compute the **desired change-set** for this track (after comments, quarantine, Node checks, bundles).
2. If desired change-set is **empty** → log `noop — nothing eligible`; do not open a PR.
3. Find **open** PR for this track.
4. Compare desired tree to the PR branch tip (or to `main` if no PR).

### A) No open PR

- Create branch from up-to-date `main`.
- Apply change-set; run **verify & migrate** (`verify-migrate.md`); commit (including fixes);
  push; `gh pr create` with label `depbot`.
- Body per `pr-style.md` (include quarantine / Node / bundles / verify sections).

### B) Open PR exists, desired == already in PR (no new changes)

- **Do not** push empty commits.
- **Do not** close/reopen the PR.
- Log: `noop — PR #<n> already up to date`.
- Optional: comment on the PR **at most once per 7 days** (`still current as of <date>`); skip if a recent identical bot comment exists.
- Exit success.

### C) Open PR exists, desired differs (new / removed / changed bumps)

- Checkout the **same** track branch (`deps/depbot`).
- Merge or rebase `main` into the branch if behind (prefer merge if unsure).
  - If conflicts cannot be resolved safely → stop; comment on the PR:
    `depbot: needs human rebase (conflicts with main)`; do **not** force-merge.
- Apply the full desired change-set for this track (replace stale bumps; drop items that
  became wait/blocked/FORBIDDEN).
- Run **verify & migrate** (`verify-migrate.md`) before treating the PR as ready; include
  migration or rollback commits on this branch.
- Create a **new commit** (do not amend published history; no force-push by default).
- Push; update PR title/body to match the new table (include Verify & migrate).
- Short PR comment: what was **added**, **removed**, migrated, or moved to wait/blocked since last run.

### D) Open PR but branch missing / unusable

- Recreate the branch from `main`, push, and update the existing PR head if `gh` allows;
  otherwise close the broken PR with comment `superseded` and open a new one on the track branch.

### E) Previous PR merged or closed

- Treat as **no open PR** → open a fresh PR for the new batch (same track branch name is fine
  after delete/recreate, or use `deps/depbot` reset from `main`).

### F) Multiple open `depbot` PRs on the same track

- Keep the newest; close others with comment `duplicate depbot PR — use #<n>`.

### G) `main` already contains the PR contents

- Close PR with comment `superseded by main` (or leave open only if commits remain unique).
- Log noop for bumps.

## Hard rules

- Never empty-push “activity” commits.
- Never silent-skip a **FORBIDDEN** Node drift or quarantine violation — report even on noop bump days.
- Never mix high-risk majors into the daily track PR unless the user explicitly asked for one combined PR.
- Never `git push --force` / `reset --hard` / `clean` unless the user explicitly overrides.
- Prefer updating **one** open daily PR in place over opening a second.

## Logging (cron-friendly)

Always print one of:

```text
noop — nothing eligible
noop — PR #123 already up to date
updated — PR #123 (added: …; removed: …)
created — PR #123
blocked — needs human rebase on PR #123
```

## Reporting in plan / PR body

When a run touches lifecycle, mention:

```markdown
## PR lifecycle
- Track: daily (`deps/depbot`)
- Action: created | updated | noop (up to date) | noop (nothing eligible) | blocked (rebase)
- PR: <url or none>
```
