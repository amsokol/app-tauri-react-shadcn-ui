# Cargo (src-tauri)

Rust deps live under **`src-tauri/`**.

## Detect

- `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`
- `rust-toolchain.toml` (channel) — **report-only** unless user asks to bump toolchain

## Scan

From repo root:

```bash
cargo update --manifest-path src-tauri/Cargo.toml --dry-run
# or:
cargo outdated --manifest-path src-tauri/Cargo.toml
```

(`cargo outdated` only if installed; otherwise dry-run / crates.io checks for named crates.)

Always run the **comment pass** on `Cargo.toml` first.

## Quarantine (2 days)

Same hard rule as pnpm — see `quarantine.md`.

- For crates.io: use version `created_at` / publish time from the registry API; skip if `< 2 days`.
- For **git tags** (e.g. mimalloc): use tag/release publish time on GitHub; skip if `< 2 days`.
- Prefer newest version that already cleared quarantine, not absolute latest.
- **Audit current pins** the same way; too-fresh pins → **FORBIDDEN** (`quarantine.md`).

## Special pins

### mimalloc (git tag)

Pinned by **git tag**, not crates.io:

```toml
mimalloc = { git = "https://github.com/amsokol/mimalloc", tag = "v3.3.2" }
```

- Bump only the **tag** (and refresh lock) when updating.
- Respect nearby hold comments (macOS TLS issues on newer tags are documented in-tree).
- Do not switch to crates.io unless the user asks.

### Tauri stack

Keep Cargo `tauri`, `tauri-build`, and `tauri-plugin-*` aligned with catalog `@tauri-apps/api` / `@tauri-apps/cli` (`coupled-deps.md` → `tauri-stack`).

`macos-private-api` / `macOSPrivateApi` are intentional for window effects — do not remove features while bumping unless asked.

## Apply

1. Edit `src-tauri/Cargo.toml` pins / git tags.
2. Refresh lock:

```bash
cargo update --manifest-path src-tauri/Cargo.toml
# or targeted:
cargo update --manifest-path src-tauri/Cargo.toml -p tauri -p tauri-build
```

3. Refresh stale `depbot:` comments after unlock bumps.

## Verify

```bash
pnpm lint:rust
pnpm lint:rust:fmt
# optional if environment allows:
pnpm tauri build
```

## Reporting

```markdown
## Cargo (src-tauri)
| Crate | Pinned | Available | Quarantine | Action |
|-------|--------|-----------|------------|--------|
| tauri | 2.11.5 | … | cleared / wait | … |
| mimalloc | git tag v3.3.2 | … | … | held / … |
```
