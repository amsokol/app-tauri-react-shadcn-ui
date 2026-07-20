# Verify and migrate

After applying dependency bumps, depbot must **build/test** and, on failure,
attempt a **minimal migration** so the repo is green again — or roll back the
offending change and report.

This is not “versions only”. A ship run is incomplete until verify passes or
the bump is reverted with a clear reason.

## When this applies

| Mode                                         | Verify + migrate               |
| -------------------------------------------- | ------------------------------ |
| Dry-run / plan-only                          | No — plan only                 |
| Ship / scheduled ship                        | **Yes** — required after apply |
| Quarantine remediation (rollback fresh pins) | Yes — verify after rollback    |

## Verify ladder

Run from repo root. Stop at the first meaningful failure, fix (or roll back), then re-run from the failed step (or full ladder if unsure).

### Daily / low-risk track

1. `pnpm install` (if catalog/lock changed)
2. `pnpm typecheck`
3. `pnpm lint`
4. If Cargo pins/lock changed: `pnpm lint:rust` and `pnpm lint:rust:fmt`

Optional if time allows and JS tooling changed: `pnpm lint:knip`.

### High-risk / major track (Vite, Tauri, React, TypeScript **major**, tauri-stack major)

Use when shipping a **major** (or user-requested high-risk special). For daily
**patch/minor** (including Vite 8.1.x → 8.1.y), the daily ladder above is enough.

1. `pnpm lint:all` (or remaining lint:\* not yet run)
2. `pnpm build`
3. If Tauri/Cargo involved and environment allows: `pnpm tauri build` (or document skip + why)

Do not claim “verified” without citing commands and exit status.

## Migration loop

On verify failure:

1. **Diagnose** — read errors; identify which bump likely caused them.
2. **Fix minimally** — only changes required for compile/lint/tests under the new versions:
   - import/API renames, type adjustments, config keys, feature flags, changelog-driven call sites
   - lockfile refresh if incomplete
3. **Re-verify** (ladder from the failed step or full).
4. Repeat until green or **stop conditions** hit.

### Allowed fix scope

- App/source under `src/`, `src-tauri/src/`, configs touched by the bump
- Catalog / Cargo pins and lockfiles already part of this change-set
- Regenerating shadcn UI **only** if the bump requires it **and** the user/skill exception allows (default: **do not** hand-edit `src/components/ui/`)

### Forbidden during migrate

- Unrelated refactors, formatting-only churn, drive-by cleanups
- Changing Node toolchain files (`node-toolchain.md`)
- Changing Rust toolchain pins **except** as a lockstep **patch** bump
  (`rust-toolchain.md`) that is part of this ship change-set
- Disabling quarantine / `minimumReleaseAge`
- Force-push, `reset --hard`, `git clean`
- Expanding the bump set “while fixing” (no piggyback majors)

## Stop conditions and rollback

Stop migrating and **roll back** the problematic package(s) (or the whole track batch if inseparable) when any of:

| Condition                                                                         | Action                                                                                                    |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Max fix rounds** exceeded (default **4** verify→fix cycles per ship run)        | Roll back offenders; report                                                                               |
| Fix would need a **major** policy exception (TS/React/Tauri/Vite) without user OK | Roll back; backlog                                                                                        |
| Blast radius unclear / multi-package failure after 2 rounds                       | Prefer roll back the newest bump first, re-verify                                                         |
| Coupled bundle member cannot migrate without leaving siblings broken              | Roll back **entire bundle**                                                                               |
| Environment cannot run a required high-risk check                                 | Do not mark verified; either skip ship for that check with explicit note, or leave PR as draft needing CI |

After rollback: refresh lockfiles, re-verify, update PR body (**rolled back:** … / **migrated:** …).

## Bundles

Migrate and verify the **whole bundle** together. Never leave one member bumped and another rolled back unless the user explicitly allows a temporary split (default: no).

## Reporting

Always include when ship/migrate ran:

```markdown
## Verify & migrate

- Commands: `pnpm typecheck` ✅, `pnpm lint` ✅, …
- Fix rounds used: 1 / 4
- Migrated (code/config): `src/…` (short list)
- Rolled back: `vite` 8.1.5 → 8.1.4 (reason: …) — or none
- Result: green | blocked (needs human)
```

## Relation to other policies

- Quarantine / Node / holds still apply **before** apply; migrate does not unlock forbidden bumps.
- PR lifecycle (`pr-lifecycle.md`): push migration commits onto the same track PR; noop only when there was nothing to apply **and** no open remediation needed.
