# Agent policy — app-tauri-react-shadcn-ui

Tauri + React + pnpm + Cargo. Shared procedures:
[`library/policy/entry.md`](library/policy/entry.md).

Overlay only: this file, [`verify.md`](verify.md), [`quarantine.md`](quarantine.md).

## Enabled ecosystems

Only listed ecosystems are in scope for deps-policy / deps-vuln. Read all topics
under each folder (`detect`, `update`, `publish-time`, `advisories`, `caution`).

- [`library/ecosystems/npm/detect.md`](library/ecosystems/npm/detect.md)
  (pnpm catalog / lockfile)
- [`library/ecosystems/cargo/detect.md`](library/ecosystems/cargo/detect.md)

## Hotspots

- Frontend: `src/`, `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- Tauri/Rust: `src-tauri/`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`,
  `rust-toolchain.toml`
- Existing `depbot:` / `agent:` holds and bundles (e.g. `tauri-stack`, `mimalloc`)

## Product notes

- Gate: changed pins in catalog / `pnpm-lock.yaml` / `package.json` /
  `src-tauri/Cargo.toml` / `Cargo.lock` / toolchain pins when touched
- High-impact majors need human OK or unlock: Tauri, React, Vite, Node, Rust
  minor/major trains
- Keep quarantine duration aligned with `pnpm-workspace.yaml`
  (`minimumReleaseAge`)
