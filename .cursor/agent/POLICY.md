# Agent policy

What “good” means for **this** product (Tauri + React + pnpm). Runner scenarios
(`pr_gate`, `main_maintain`) are generic; this file is product-specific.

Quarantine duration must stay aligned with `pnpm-workspace.yaml`
(`minimumReleaseAge`).

## Gate (`pr_gate`)

- Block correctness bugs and security-relevant defects in the PR diff.
- Dependency policy applies to **changed** pins / lockfile entries only
  (`pnpm-workspace.yaml` catalog, `pnpm-lock.yaml`, `src-tauri/Cargo.toml` /
  `Cargo.lock`, toolchain pins).
- **Release quarantine (approach):** do not adopt a version until it has been
  published for at least **N days** (duration below). Younger pins are policy
  breaches (FORBIDDEN on current pins; wait on candidates). Document any
  security exception that bypasses the window.
- Majors / new trains of high-impact frameworks need explicit human OK (or an
  unlock comment): Tauri, React, Vite, Node, Rust minor/major trains.
- Verdict only: no Issues / fix PRs from gate.

### Quarantine duration (this product)

| Setting          | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Quarantine       | **2 days** (48 hours)                                                    |
| pnpm enforcement | `minimumReleaseAge: 2880` minutes in `pnpm-workspace.yaml` (same window) |

Do not lower or disable `minimumReleaseAge` unless the policy owner explicitly
overrides it here and in `pnpm-workspace.yaml` together.

## Maintain (`main_maintain`)

- Scan the full repo: code hotspots + dependency graph (pnpm catalog, Cargo,
  toolchains).
- Enforce the **same** quarantine approach and duration as gate when proposing
  bumps.
- Open Issues for actionable findings; fix PR when remediation verifies.
- Reconcile against **this checkout only**.
- Never APPROVE product pull requests.

## Overrides

- `# agent: hold — <reason>` (or historical `# depbot: hold — <reason>`) near a
  pin: do not bump until unlock conditions are met.
- Explicit accepted-risk comments may clear **non-critical** gate findings;
  critical and policy FORBIDDEN states need a documented exception.
