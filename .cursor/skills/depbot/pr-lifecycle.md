# PR lifecycle (daily / recurring runs)

Depbot may run on a schedule (e.g. daily). Runs must be **idempotent**: one open
PR per track, no empty pushes, no duplicate PRs.

## Tracks

| Track                             | Branch                                        | Label            | Typical contents                                                                                                                  |
| --------------------------------- | --------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **daily**                         | `deps/depbot`                                 | `depbot`         | Eligible **patch/minor** bumps (incl. Vite/React/Tauri/TS non-majors), **Rust toolchain patches**, cleared bundles, Cargo patches |
| **high-risk** (optional separate) | `deps/depbot-<topic>` e.g. `deps/depbot-vite` | `depbot` + topic | **Majors** of Vite / Tauri / React / TypeScript; **Rust new trains** — not mixed into daily                                       |

Default scheduled run uses the **daily** track only unless the user asks otherwise.

Identify an existing PR by: open state + label `depbot` + head branch matching the track
(prefer `gh pr list --label depbot --state open` and filter by branch).

## Sync strategy (hybrid)

| Situation                              | Strategy                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------ |
| No open PR (or previous closed/merged) | **Recreate** track branch from `origin/main` (§A)                        |
| Open PR, branch healthy                | **Merge** `origin/main` into track branch **before** scan (§1 / §B / §C) |
| Open PR + recreate trigger (below)     | **Close + recreate** (§R), then scan/apply on the new branch             |

Default for a normal open PR: **merge-first**, not close+recreate every run.
Preserve review history unless a recreate trigger fires.

### Recreate triggers (any one → §R)

Use close+recreate when **any** of:

1. **Merge conflict** with `origin/main` (do not leave a half-merged tree).
2. Track branch tip is **> 14 days** behind `origin/main` (by commit date or first-parent age).
3. Previous run left the PR **blocked** for rebase / unusable branch (§D).
4. User / workflow explicitly asked to recreate (`strategy=recreate` or clear instruction).
5. Branch history is clearly corrupted (missing branch, wrong head, force-push wreckage).

When recreating: comment on the old PR `depbot: superseded — recreating track from main`,
close it, delete remote track branch if needed, then §A (new PR).

## Algorithm (each run that is allowed to open/update PRs)

**Order:** decide merge vs recreate → sync branch → **then** scan deps.

0. `git fetch origin`. Find **open** PR for this track (`depbot` + `deps/depbot`).
1. **If open PR exists:**
   - If a **recreate trigger** matches → §R, then continue from the new branch.
   - Else **merge-first** before any dep scan:
     - `git checkout deps/depbot`
     - `git merge origin/main`
     - Conflicts → treat as recreate trigger **(1)** → §R (preferred) **or** stop with
       `blocked — needs human` only if recreate is impossible (no permission). Prefer §R.
     - Push merge when convenient; do not scan while still behind `main`.
2. **Then** discovery / comments / quarantine / scans / plan (desired change-set).
3. If desired change-set is **empty** and there is no open PR → `noop — nothing eligible`.
4. Compare desired tree to the synced PR tip, or to `main` if no PR.

### R) Close + recreate (triggered)

1. Comment on open PR: `depbot: superseded — recreating track from main (<reason>)`.
2. `gh pr close <n>` (do not merge).
3. Delete remote track branch if it still exists:
   `git push origin --delete deps/depbot` (best effort).
4. Follow **§A** (fresh branch + new PR).
5. Log: `recreated — PR #<old> closed; PR #<new> from main (<reason>)`.

### A) No open PR (including after a closed/merged PR)

**Stale track branches are expected** after close. Do **not** continue from that tip.

1. Update local `main` from `origin/main`.
2. `git checkout -B deps/depbot origin/main`
3. If `origin/deps/depbot` still exists and differs, publish with
   **`--force-with-lease`** (only with **no** open track PR) or delete-then-push.
4. Apply the **full desired change-set** (do not reuse old bump commits).
5. **Verify & migrate**; commit; push (normal).
6. `gh pr create` with label `depbot`.

### B) Open PR exists, desired == already in PR (no new changes)

(After successful merge-from-main; bumps unchanged:)

- Push the merge if needed.
- No empty “activity” commits beyond the merge.
- Log: `noop — PR #<n> already up to date`.
- Optional comment at most once per 7 days.
- Exit success.

### C) Open PR exists, desired differs

(Branch already contains `origin/main` from merge-first.)

- Apply full desired change-set; drop wait/blocked/FORBIDDEN items.
- **Verify & migrate**; new commit (no amend of published history; no force-push).
- Push; refresh PR title/body; short comment of added/removed/migrated.

### D) Open PR but branch missing / unusable

- Recreate trigger **(5)** → §R.

### E) Previous PR merged or closed

- Treat as **no open PR** → §A.

### F) Multiple open `depbot` PRs on the same track

- Keep the newest; close others: `duplicate depbot PR — use #<n>`.

### G) `main` already contains the PR contents

- Close PR: `superseded by main`. Log noop for bumps.

## Hard rules

- Never empty-push “activity” commits.
- Never silent-skip a **FORBIDDEN** Node drift or quarantine violation — report even on noop bump days.
- Never mix high-impact **majors** into the daily track PR unless the user explicitly asked.
  Patch/minor of Vite/React/Tauri/TypeScript **belong on daily** (`grouping.md`).
- Never `git clean` / `reset --hard` of **unrelated** worktrees or user branches.
- **`git push --force` is forbidden** except:
  - **No open** track PR, replacing `origin/deps/depbot` (or topic branch) to match a
    brand-new branch from `origin/main` (§A / §R).
  - Prefer `--force-with-lease` or delete-then-push.
  - **Never** force-push while an open depbot PR still points at that branch
    (close via §R first, then recreate).
- Prefer **one** open daily PR; merge-first unless a recreate trigger fires.

## Logging (cron-friendly)

```text
noop — nothing eligible
noop — PR #123 already up to date
updated — PR #123 (added: …; removed: …)
created — PR #123 (track branch reset from main)
recreated — PR #122 closed; PR #123 from main (conflict|age|blocked|user)
blocked — needs human rebase on PR #123
```

## Reporting in plan / PR body

```markdown
## PR lifecycle

- Track: daily (`deps/depbot`)
- Strategy: merge-first | recreate | n/a (no open PR)
- Action: created | updated | noop | recreated | blocked
- PR: <url or none>
```
