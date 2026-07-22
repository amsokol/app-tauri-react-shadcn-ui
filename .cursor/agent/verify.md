# Verify after fixes

After applying dependency or code fixes, run these commands. Ship a fix PR only
when they pass. On failure: fix forward or roll back.

## Commands (this product)

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint:all
pnpm typecheck
pnpm build
```

Optional advisory scan (informational unless a fix is in scope):

```bash
pnpm security:audit || true
cargo audit --manifest-path src-tauri/Cargo.toml || true
```

## Rules

- Prefer existing CI steps (lint / typecheck / build) over inventing tools.
- Do not lower quarantine or disable policy to make verify pass.
- Record commands + results in the fix PR body.
