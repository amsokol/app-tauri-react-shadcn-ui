# PR lifecycle (daily / recurring runs)

Depbot may run on a schedule (e.g. daily). Runs must be **idempotent**: one open
PR per track, no empty pushes, no duplicate PRs.

## Tracks

| Track                             | Branch                                        | Label            | Typical contents                                                               |
| --------------------------------- | --------------------------------------------- | ---------------- | ------------------------------------------------------------------------------ |
| **daily**                         | `deps/depbot`                                 | `depbot`         | Low-risk pnpm patches, cleared bundles (e.g. tailwind), eligible Cargo patches |
| **high-risk** (optional separate) | `deps/depbot-<topic>` e.g. `deps/depbot-vite` | `depbot` + topic | Vite / Tauri / React majors — **not** mixed into daily                         |

Default scheduled run uses the **daily** track only unless the user asks otherwise.

Identify an existing PR by: open state + label `depbot` + head branch matching the track
(prefer `gh pr list --label depbot --state open` and filter by branch).

## Algorithm (each run that is allowed to open/update PRs)

1. Compute the **desired change-set** for this track (after comments, quarantine, Node checks, bundles).
2. If desired change-set is **empty** → log `noop — nothing eligible`; do not open a PR.
3. Find **open** PR for this track.
4. Compare desired tree to the PR branch tip (or to `main` if no PR).

### A) No open PR (including after a closed/merged PR)

**Stale track branches are expected** (GitHub often keeps `deps/depbot` after the PR is closed).
Do **not** continue from that tip — it may contain an old batch.

Mandatory reset procedure:

1. `git fetch origin` and update local `main` (`origin/main`).
2. Recreate the track branch **exactly from** `origin/main`:
   `git checkout -B deps/depbot origin/main`
3. If `origin/deps/depbot` still exists and differs from this new tip, publish with a
   **narrow force-with-lease** (allowed only in this case — see Hard rules):
   `git push --force-with-lease origin deps/depbot`
   Prefer deleting the remote branch first when you have permission:
   `git push origin --delete deps/depbot`, then a normal push of the new branch.
4. Apply the **full desired change-set** on this clean branch (do not reuse old bump commits).
5. Run **verify & migrate**; commit; push (normal push).
6. `gh pr create` with label `depbot`.

Never: `git checkout deps/depbot` on a leftover remote tip and “add a few more bumps”.

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

- Treat as **no open PR** → follow **§A** (always recreate track branch from `main`).
- Do not reopen the closed PR; open a **new** PR for the new batch.
- Closed-PR comments are optional (`superseded by new run` only if useful).

### F) Multiple open `depbot` PRs on the same track

- Keep the newest; close others with comment `duplicate depbot PR — use #<n>`.

### G) `main` already contains the PR contents

- Close PR with comment `superseded by main` (or leave open only if commits remain unique).
- Log noop for bumps.

## Hard rules

- Never empty-push “activity” commits.
- Never silent-skip a **FORBIDDEN** Node drift or quarantine violation — report even on noop bump days.
- Never mix high-risk majors into the daily track PR unless the user explicitly asked for one combined PR.
- Never `git clean` / `reset --hard` of **unrelated** worktrees or user branches.
- **`git push --force` is forbidden** except this single automation case:
  - **No open** track PR, and you are replacing `origin/deps/depbot` (or `deps/depbot-<topic>`)
    so it matches a brand-new branch created from `origin/main` for a fresh batch.
  - Prefer `git push --force-with-lease` or delete-then-push.
  - **Never** force-push while an open depbot PR still points at that branch (use §C instead).
- Prefer updating **one** open daily PR in place over opening a second.

## Logging (cron-friendly)

Always print one of:

```text
noop — nothing eligible
noop — PR #123 already up to date
updated — PR #123 (added: …; removed: …)
created — PR #123 (track branch reset from main)
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
