# Dependency audits

## pnpm

```bash
pnpm security:audit
# For clustering:
pnpm audit --json
```

Honor `pnpm-workspace.yaml` catalog pins and `pnpm.overrides` when proposing bumps.

## Cargo

```bash
# If cargo-audit is available:
cargo audit --file src-tauri/Cargo.lock
# Else: research RustSec for direct deps in src-tauri/Cargo.toml
```

Do not invent a Cargo audit CI job; prefer `cargo audit` when installed, otherwise
OSV/RustSec research for **direct** crates.

## Quarantine vs security fixes

Depbot quarantine in this repo is **2 days**. Prefer fixed versions that cleared
it. Inside the window → document **security exception** in PR/issue + cite advisory
(same spirit as `depbot: security ok`).

## Report table

```markdown
| Ecosystem | Package | Current | Advisory | Severity | Fixed in | Action |
| --------- | ------- | ------- | -------- | -------- | -------- | ------ |
```
