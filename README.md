# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Dependency cooldown (supply chain)

JS dependencies use **pnpm** [`minimumReleaseAge`](https://pnpm.io/settings) in `pnpm-workspace.yaml` (2 days, in minutes).

Rust dependencies can be checked with **[cargo-cooldown](https://crates.io/crates/cargo-cooldown)** using `src-tauri/cooldown.toml` (same 2-day window). Install the plugin once:

```bash
cargo install --locked cargo-cooldown
```

Run Cargo through it. The Rust manifest is under **`src-tauri/`**, so **`./Cargo.toml` at the repo root does not exist** (*manifest path does not exist*).

**Important:** `cargo-cooldown` reads **`cooldown.toml` from your shell’s current directory** (`./cooldown.toml`), **not** from the directory of `--manifest-path`. So **`src-tauri/cooldown.toml` is only loaded if you run commands with `cd src-tauri`** (see [`workspace_config_path`](https://github.com/dertin/cargo-cooldown/blob/main/src/config.rs)). From the repo root, cooldown is effectively off unless you set `COOLDOWN_MINUTES` or add a `./cooldown.toml` at the root.

**Recommended** (uses `src-tauri/cooldown.toml`):

```bash
cd src-tauri
cargo cooldown check
```

Verify the 2-day window is active:

```bash
cd src-tauri
COOLDOWN_VERBOSE=true cargo cooldown metadata --format-version 1 2>&1 | grep minimum_minutes | head -1
# expect: minimum_minutes=2880
```

To run **from the repo root** without a root `cooldown.toml`, pass the same window explicitly (overrides nothing, but mirrors the file):

```bash
COOLDOWN_MINUTES=2880 cargo cooldown --manifest-path src-tauri/Cargo.toml check
```

`cargo-cooldown` needs to reach **crates.io** (and may change `Cargo.lock` when it pins older versions). If you see DNS or network errors, check your connection, VPN, or corporate proxy.

Override per run with `COOLDOWN_MINUTES`, or relax specific crates via a `cooldown-allowlist.toml` (see the crate README). CI can keep using plain `cargo` against a committed `Cargo.lock`.
