# Verify & migrate

Before opening/updating a fix PR, run a CI-aligned ladder (stop on first hard fail):

```bash
pnpm install --frozen-lockfile   # after lockfile edits: drop --frozen and re-lock
pnpm typecheck
pnpm lint
pnpm lint:rust
pnpm security:audit
pnpm build
```

For Cargo-only bumps under `src-tauri/`: at least `pnpm lint:rust` +
`cargo check --manifest-path src-tauri/Cargo.toml` before the full JS ladder.

## Rules

- Ship must verify; if still red after **2** fix rounds, roll back, update issue, report.
- Smallest change that clears the finding.
- After dep bumps, re-run `pnpm security:audit` / cargo advisory check.
- Respect catalog: bump versions in `pnpm-workspace.yaml` `catalog:` when that is
  where the pin lives (same as depbot).
