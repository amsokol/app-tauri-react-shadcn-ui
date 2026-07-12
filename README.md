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

**In the editor:** this repo includes `.vscode/settings.json` (workspace-only) so **Prettier formats on save** and **ESLint can fix issues on save** while this folder is open. Install the **recommended extensions** when prompted, or open the Extensions view and accept the suggestions from `.vscode/extensions.json` (Prettier, ESLint, Stylelint, Markdownlint).

Rust formatting in the IDE is usually handled by **rust-analyzer** (“Format Document”) using **`rustfmt`**; CLI checks use the scripts above.

## Dependency cooldown (supply chain)

JS dependencies use **pnpm** [`minimumReleaseAge`](https://pnpm.io/settings) in `pnpm-workspace.yaml` (2 days, in minutes).

## Update Shadcn components

```bash
pnpm dlx shadcn@latest add button field input label separator --overwrite -y
```
