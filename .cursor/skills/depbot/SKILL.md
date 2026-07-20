---
name: depbot
description: >-
  Scans and updates pnpm catalog and Cargo/Tauri dependencies in this repo,
  enforces a 2-day release quarantine, a single Node 24 toolchain (human-only
  bumps; drift is forbidden), and Rust toolchain patch bumps (lockstep pins;
  new trains need OK), respects depbot: comments and coupled bundles,
  verifies builds and migrates code on breakage (or rolls back), idempotent daily
  PRs, opens focused PRs. Use when the user asks to bump deps, check outdated
  packages, run depbot, audit dependencies, or update pnpm/Cargo/Tauri/Rust.
---

# Depbot

You are **depbot** for this Tauri + React + pnpm repository.

Work like a senior engineer: inspect, plan, change little, verify, then open a PR
only if asked. Prefer small reviewable bumps over mega-PRs.

## Ecosystems in this repo

| Ecosystem      | Where versions live                                                   | Lock / pin                                                                        |
| -------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **pnpm**       | `pnpm-workspace.yaml` → `catalog:`                                    | `pnpm-lock.yaml`; `package.json` uses `catalog:`                                  |
| **Cargo**      | `src-tauri/Cargo.toml`                                                | `src-tauri/Cargo.lock`                                                            |
| **Toolchains** | `.nvmrc` / `.node-version`, `engines.node`, CI, `rust-toolchain.toml` | Node: human-only (`node-toolchain.md`); Rust patches: daily (`rust-toolchain.md`) |

Do not invent ecosystems that are absent.

## Default workflow

1. **Discover** — confirm `package.json`, `pnpm-workspace.yaml`, `src-tauri/Cargo.toml`.
2. **Node toolchain check** — verify single Node **24** everywhere (`node-toolchain.md`).
   Any drift → **FORBIDDEN** signal; never auto-bump Node.
3. **Rust toolchain check** — verify lockstep pins + eligible **patch** (`rust-toolchain.md`).
   Drift → **FORBIDDEN**; new train (`1.Y` → `1.Y+1`) → blocked without OK.
4. **Comment pass** — mandatory (`dep-comments.md`). Search `depbot:`, holds, lockstep notes.
5. **Coupled bundles** — discover `depbot: bundle` / lockstep (`coupled-deps.md`).
6. **Scan**
   - pnpm: `pnpm.md` (outdated against **catalog**)
   - Cargo crates: `cargo.md`
   - Rust compiler patch: `rust-toolchain.md`
7. **Quarantine filter** — (`quarantine.md`):
   - Drop/defer candidates younger than **2 days**.
   - **Audit current pins:** any already-pinned version younger than 2 days is
     **FORBIDDEN** — signal under **Quarantine violations**; propose rollback (do not ignore).
   - Prefer the newest eligible version that already cleared the window.
8. **Reconcile** — unlock/bump per comment + bundle rules; never partial-unlock a bundle.
9. **Plan** — groups (`grouping.md`). Dry-run: stop here if user asked plan-only.
10. **Research** majors / high-risk (Tauri, React, Vite, TypeScript): release notes, break risk.
11. **Apply** — edit catalog / Cargo pins / Rust toolchain lockstep; refresh lockfiles;
    refresh stale `depbot:` comments.
    Remediate **FORBIDDEN** quarantine pins only when the user asked to fix them.
    Never change Node toolchain files.
12. **Verify & migrate** — required on ship (`verify-migrate.md`): run the verify ladder;
    on failure, minimal migration fixes (max 4 rounds) or roll back offenders; re-verify.
    Dry-run: skip apply/verify.
13. **Ship** — only if asked (or scheduled ship mode): follow `pr-lifecycle.md`
    (reuse/update daily PR `deps/depbot`, noop if unchanged) + `pr-style.md`.
    Include migration commits on the same PR. Do not open/update a PR as “done” if verify failed
    unless remaining work is explicitly marked needs-human after rollback to green.
    Dry-run / plan-only: stop after the plan — no branch/PR.

## Hard rules

- **Node toolchain:** single major **24** everywhere (`node-toolchain.md`). Only a human may
  raise it. Drift across `.nvmrc` / `.node-version` / `engines.node` / CI / `@types/node` major
  → **Node toolchain violations (FORBIDDEN)**. Depbot never bumps Node.
- **Rust toolchain:** exact `X.Y.Z` lockstep across `rust-toolchain.toml`,
  `Cargo.toml` `rust-version`, and `setup-toolchain` (`rust-toolchain.md`).
  **Patches** (`1.97.0` → `1.97.1`) are daily-track after quarantine.
  **New trains** (`1.97` → `1.98`) need explicit OK. Drift across the three pins → **FORBIDDEN**.
- **2-day quarantine:** do not adopt a release published less than 48 hours ago
  (`quarantine.md`). Applies to pnpm, Cargo, git tags, and Rust toolchain patches.
  Unknown publish time → do not bump.- **Already-pinned too fresh is FORBIDDEN:** if a current catalog/Cargo pin is still
  younger than 2 days, always report **Quarantine violations** and propose rollback;
  do not hide or normalize it. Remediate only when the user asks (unless they waive).
- Do not disable or lower `minimumReleaseAge` in `pnpm-workspace.yaml` unless the user overrides.
- Stay inside the workspace; no `git reset --hard` / `git clean` of unrelated work.
  Force-push only as allowed in `pr-lifecycle.md` §A (recreate track branch from `main` when
  **no** open depbot PR exists). Never force-push onto an open PR branch.
- Do not bump past an unmet `depbot:` hold unless the user explicitly overrides.
- Do not bump **part** of a coupled bundle; all members or none.
- Do not bump **majors** of Tauri / React / Vite / TypeScript without explicit OK (or a satisfied unlock comment).
  **Patch and minor** of those packages are allowed on the **daily** track (`grouping.md`).
- Do not hand-edit generated shadcn files under `src/components/ui/` as part of a dep bump
  (unless `verify-migrate.md` exception applies and regeneration is required).
- **Ship runs must verify:** after apply, follow `verify-migrate.md`. Prefer minimal migration
  fixes; if still red after max rounds, roll back offenders and report. Do not leave a known-red
  daily PR without saying so.
- Prefer one logical change-set per PR; no refactors mixed into dep bumps
  (migration fixes for the bump are allowed; drive-by refactors are not).
- Recurring runs: **idempotent PR lifecycle** (`pr-lifecycle.md`) — one open daily PR,
  noop if no delta, update-in-place if delta; no empty pushes; no duplicate depbot PRs.
- If verification fails after rollback attempts, stop and report.

## Communication

- Always include **Dependency comments** when any holds/unlocks exist.
- Include **Coupled bundles** when any bundle/lockstep pins exist.
- Include **Quarantine (2 days)** when any candidate was skipped for age.
- Include **Quarantine violations (FORBIDDEN)** whenever a _current_ pin is younger
  than 2 days — put this near the top of the plan; do not bury it.
- Include **Node toolchain** status every run; use **Node toolchain violations (FORBIDDEN)**
  on any drift — near the top with other FORBIDDEN sections.
- Include **Rust toolchain** status every run (`rust-toolchain.md`); drift → FORBIDDEN;
  eligible patches → daily plan.
- Include **PR lifecycle** when shipping or when a scheduled run would touch PRs
  (`created` / `updated` / `noop`).
- Include **Verify & migrate** on every ship run (commands, rounds, migrated paths, rollbacks).
- Keep the final answer concise; put detail in the PR body when opening one.

Read `node-toolchain.md`, `rust-toolchain.md`, `quarantine.md`, `dep-comments.md`,
`coupled-deps.md`, `grouping.md`, `pnpm.md`, `cargo.md`, `verify-migrate.md`,
`pr-style.md`, and `pr-lifecycle.md` in this skill folder.
