# Agent policy

What “good” means for **this** product (Tauri + React + pnpm + Cargo).
Runner scenarios (`pr_gate`, `main_maintain`) are generic.

Skills live in the shared submodule
[`library/`](library/README.md) ([ai-devsecops-skills](https://github.com/amsokol/ai-devsecops-skills)
@ `v0.1.0`). Product overlay: this file, [`verify.md`](verify.md),
[`quarantine.md`](quarantine.md).

**Read order:** this file, then every linked skill. Do not invent policy numbers
(especially quarantine duration). Keep quarantine duration aligned with
`pnpm-workspace.yaml` (`minimumReleaseAge`).

## Enabled ecosystems

Only listed ecosystems are in scope for deps-policy / deps-vuln.

- [`library/ecosystems/npm/detect.md`](library/ecosystems/npm/detect.md)
  — also read sibling topics: `update`, `publish-time`, `advisories`, `caution`
  under `library/ecosystems/npm/` (pnpm catalog / lockfile)
- [`library/ecosystems/cargo/detect.md`](library/ecosystems/cargo/detect.md)
  — also read sibling topics under `library/ecosystems/cargo/`

## Entry (always)

1. This file and every link below.
2. Scenario procedure: [`library/scenarios/gate.md`](library/scenarios/gate.md) or
   [`library/scenarios/maintain.md`](library/scenarios/maintain.md) (match the active scenario).
3. Forge: [`library/scm/github.md`](library/scm/github.md) or
   [`library/scm/gitlab.md`](library/scm/gitlab.md) (match runtime `scm` / `AGENT_SCM`).
4. [`library/policy/signals.md`](library/policy/signals.md)

## Linked skills

- [`library/policy/signals.md`](library/policy/signals.md) — `AGENT_SIGNAL` catalog
- [`library/scenarios/gate.md`](library/scenarios/gate.md) — gate procedure
- [`library/scenarios/maintain.md`](library/scenarios/maintain.md) — maintain procedure
- [`library/scm/github.md`](library/scm/github.md) / [`library/scm/gitlab.md`](library/scm/gitlab.md) — forge CLI/tokens
- [`quarantine.md`](quarantine.md) — release quarantine (**2 days**)
- [`library/policy/holds.md`](library/policy/holds.md) — pin holds / unlocks / comment pass
- [`library/policy/grouping.md`](library/policy/grouping.md) — PR grouping for bumps
- [`library/policy/bundles.md`](library/policy/bundles.md) — coupled bundles
- [`library/maintain/findings.md`](library/maintain/findings.md) — Issues (maintain)
- [`verify.md`](verify.md) — post-fix verification
- [`library/gate/change-review.md`](library/gate/change-review.md) — gate reviews (forge-neutral)
- [`library/maintain/pr-lifecycle.md`](library/maintain/pr-lifecycle.md) — maintain fix PRs
- [`library/capabilities/code-quality.md`](library/capabilities/code-quality.md)
- [`library/capabilities/code-vuln.md`](library/capabilities/code-vuln.md)
- [`library/capabilities/deps-policy.md`](library/capabilities/deps-policy.md)
- [`library/capabilities/deps-vuln.md`](library/capabilities/deps-vuln.md)

## Gate (`pr_gate`)

- Block correctness bugs and security-relevant defects in the PR diff.
- Dependency policy applies to **changed** pins / lockfile entries only for
  enabled ecosystems (`pnpm-workspace.yaml` catalog, `pnpm-lock.yaml`,
  `package.json`, `src-tauri/Cargo.toml` / `Cargo.lock`, toolchain pins when
  touched).
- Apply quarantine, holds, grouping, and bundles on those changes.
- Majors / new trains of high-impact frameworks need explicit human OK (or an
  unlock comment): Tauri, React, Vite, Node, Rust minor/major trains.
- Answer human questions in PR conversation and review threads (ship).
- Verdict only: follow [`library/gate/change-review.md`](library/gate/change-review.md) and
  [`library/scenarios/gate.md`](library/scenarios/gate.md). No Issues / fix PRs from gate.

## Maintain (`main_maintain`)

- Scan the full repo: `src/`, `src-tauri/`, manifests, workflows.
- Enforce the **same** quarantine approach and duration as gate.
- Open Issues per [`library/maintain/findings.md`](library/maintain/findings.md); fix PR per
  [`library/maintain/pr-lifecycle.md`](library/maintain/pr-lifecycle.md) when [`verify.md`](verify.md) passes.
- Reconcile against **this checkout only**.
- Never APPROVE product pull requests.
- Procedure: [`library/scenarios/maintain.md`](library/scenarios/maintain.md).

## Hotspots

- Frontend: `src/`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- Tauri/Rust: `src-tauri/`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`,
  `rust-toolchain.toml`
- Existing `depbot:` / `agent:` holds and bundles in manifests (e.g. `tauri-stack`,
  `mimalloc` hold)

## Overrides

See [`library/policy/holds.md`](library/policy/holds.md). Explicit accepted-risk comments may clear
**non-critical** gate findings; critical and policy FORBIDDEN states need a
documented exception.
