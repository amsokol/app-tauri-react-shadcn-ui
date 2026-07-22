# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) or [Cursor](https://cursor.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Formatting and linting

From the **repo root**, after `pnpm install`:

- **`pnpm format`** — Write formatting with [Prettier](https://prettier.io) (import sorting via `.prettierrc.json`; ignores `.prettierignore`).
- **`pnpm format:check`** — Check only (use in CI; exits non-zero if anything needs formatting).
- **`pnpm lint`** — ESLint for TS/TSX (`eslint.config.js`): TypeScript (including type-aware rules), React, accessibility, imports, etc.
- **`pnpm lint:stylelint`** — Stylelint on `**/*.{css,scss}` (`.stylelintrc.json`).
- **`pnpm lint:md`** — Markdownlint ([markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2), `.markdownlint-cli2.jsonc`).
- **`pnpm lint:knip`** — Find unused files, exports, and dependencies (`knip.json`).
- **`pnpm lint:rust`** — `cargo clippy` (requires [Rust](https://www.rust-lang.org/) and a buildable `src-tauri/Cargo.toml`).
- **`pnpm lint:rust:fmt`** — `cargo fmt` in check mode.
- **`pnpm lint:all`** — Runs the JavaScript/CSS/Markdown/Rust checks above in one command.
- **`pnpm security:audit`** — `pnpm audit` (advisories; not part of `lint:all`).

**shadcn UI:** generated files under `src/components/ui/` are excluded from ESLint, Prettier, and knip (re-add components with the shadcn CLI rather than hand-linting them).

**CI:** GitHub Actions (`.github/workflows/ci.yml`) runs `format:check`, `lint:all`, `typecheck`, `security:audit` (non-blocking while transitive advisories remain), and `pnpm build` on **Ubuntu**, **macOS**, and **Windows** for pushes and pull requests to `main`.

**Agent gate** (`.github/workflows/agent-gate.yml`): on PR open/sync/reopen **and** on **human** PR conversation / review-thread comments, runs `agent-gate` as `github-actions[bot]` (latest run cancels prior; bot comments do not re-trigger). **Agent maintain** on push to `main` runs `agent-maintain`. Policy overlay: `.cursor/agent/` + skills submodule `.cursor/agent/library` ([ai-devsecops-skills](https://github.com/amsokol/ai-devsecops-skills) @ `v0.1.2`).

**In the editor:** this repo includes `.vscode/settings.json` (workspace-only) so **Prettier formats on save** and **ESLint can fix issues on save** while this folder is open. Install the **recommended extensions** when prompted, or open the Extensions view and accept the suggestions from `.vscode/extensions.json` (Prettier, ESLint, Stylelint, Markdownlint).

Rust formatting in the IDE is usually handled by **rust-analyzer** (“Format Document”) using **`rustfmt`**; CLI checks use the scripts above.

## Dependency cooldown (supply chain)

JS dependencies use **pnpm** [`minimumReleaseAge`](https://pnpm.io/settings) in `pnpm-workspace.yaml` (2 days, in minutes).

## Native dependencies

### mimalloc (git fork)

The Rust binary uses [Microsoft mimalloc](https://github.com/microsoft/mimalloc) via the project-maintained bindings at [`amsokol/mimalloc`](https://github.com/amsokol/mimalloc), pinned by **git tag** (not crates.io):

```toml
mimalloc = { git = "https://github.com/amsokol/mimalloc", tag = "v3.4.1" }
```

This is intentional: the fork tracks mimalloc 3.x with edition 2024 bindings. Prefer bumping the **tag** (and refreshing `Cargo.lock`) over switching to crates.io unless those bindings are published there.

### macOS private API

`macOSPrivateApi` in `src-tauri/tauri.conf.json` and the `macos-private-api` Cargo feature are enabled so macOS can use `windowEffects` (e.g. `contentBackground`). That relies on Apple private APIs and can affect **Mac App Store** eligibility and notarization review — reassess before shipping a Mac distribution build. Windows uses Mica/Acrylic in Rust setup instead; Linux falls back to CSS glass styling.

## Update Shadcn components

```bash
pnpm dlx shadcn@latest add button field input label separator --overwrite -y
```
