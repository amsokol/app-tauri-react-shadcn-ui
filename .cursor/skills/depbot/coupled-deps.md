# Coupled dependencies (bundles)

Some pins must move together (same version family or codegen/runtime lockstep).
Scan, unlock, apply, and verify as one unit — never partially.

## When to declare a bundle

- JS and Rust sides of Tauri must stay compatible (`@tauri-apps/api`, `@tauri-apps/cli`, Cargo `tauri` / `tauri-build` / plugins).
- Two catalog packages share a release train (e.g. `react` + `react-dom`, `@types/react*`).
- Unlock needs multiple evidence sources (ALL conditions).
- Comments say lockstep / aligned / move together.

## Marker

```yaml
# depbot: bundle tauri-stack
# depbot: hold — bump bundle when ALL unlock:
#   - npm: @tauri-apps/api, @tauri-apps/cli at target 2.x
#   - crates.io: tauri, tauri-build, tauri-plugin-* compatible with that 2.x
"@tauri-apps/api": =2.11.1
```

Put the same `depbot: bundle <id>` on every member (catalog + Cargo).

## Workflow

1. Discover via `depbot: bundle` and lockstep language.
2. List members (file, pin, how to check availability).
3. Scan each member.
4. Unlock for the **bundle**: any unmet condition → entire bundle **blocked**.
   Every member’s target must also clear the **2-day quarantine** (`quarantine.md`).
5. Plan one row per bundle (single action: bump / blocked).
6. Apply all members + refresh both lockfiles in one change-set.
7. Verify after the full bundle lands.

## Known couplings in this repo

| Bundle (suggested id) | Members |
|-----------------------|---------|
| `tauri-stack` | catalog `@tauri-apps/api`, `@tauri-apps/cli`; Cargo `tauri`, `tauri-build`, `tauri-plugin-window-state` |
| `react` | catalog `react`, `react-dom`, `@types/react`, `@types/react-dom` |
| `tailwind` | catalog `tailwindcss`, `@tailwindcss/vite` (and related if pinned together) |

Infer unnamed lockstep from context and name the bundle in the plan table.

## Reporting

```markdown
## Coupled bundles
| Bundle | Members | Pinned | Target | Unlock | Action |
|--------|---------|--------|--------|--------|--------|
| `tauri-stack` | … | … | … | … | blocked / bump bundle |
```
