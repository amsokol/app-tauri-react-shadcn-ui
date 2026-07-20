# Grouping policy

How to split dependency updates into reviewable units.

## Prefer

- **Patch / minor** of the same ecosystem together on the **daily** track (including
  Vite / React / Tauri / TypeScript **non-majors**).
- **One PR per major** of high-impact packages (Tauri, React, Vite, TypeScript) —
  separate high-risk track; needs explicit user OK unless an unlock comment allows it.
- **Security** soonest; may be its own PR.
- **Same reason together** (e.g. all ESLint-related catalog minors).

## Avoid

- Mixing **majors** of high-impact packages into the daily PR unless the user asks.
- Bundling a major with dozens of unrelated patches.
- Touching app UI/logic “while we’re here”.
- Editing `src/components/ui/` as part of routine bumps (regenerate via shadcn CLI only if a bump requires it and the user asked).

## Risk tiers and tracks

| Tier                  | Examples                                                                 | Daily track?                                 | Verify                        |
| --------------------- | ------------------------------------------------------------------------ | -------------------------------------------- | ----------------------------- |
| Low                   | prettier, stylelint, knip, `@types/*` patch                              | **Yes**                                      | daily ladder                  |
| Medium                | eslint plugins, small libs, **Vite/React/Tauri/TS patch+minor**          | **Yes**                                      | daily ladder (skim changelog) |
| High (**major** only) | major bump of `tauri*`, `react`, `vite`, `typescript`; mimalloc tag line | **No** — separate track / blocked without OK | full ladder + migrate         |

Examples:

- `vite` `8.1.4 → 8.1.5` (patch) → **daily**
- `vite` `8.x → 9.x` (major) → **blocked** / high-risk track with explicit OK
- `react` `19.2.7 → 19.2.8` → **daily**; `19 → 20` → separate / blocked

Ship runs always follow `verify-migrate.md` (fix or roll back — do not leave silent red).

## Bundles vs PR groups

- **Bundle** (`coupled-deps.md`) = must land together atomically.
- **PR group** = review packaging.
- **Daily track** (`pr-lifecycle.md`): all eligible **patch/minor** bumps (including Vite/React/Tauri/TS non-majors) share one open PR (`deps/depbot`).
- **High-risk track**: **majors** of high-impact packages only (or user-requested specials).

## Huge lists

1. Prioritize: security → patch → minor → selected majors (majors only with OK).
2. Execute only the agreed batch.
3. Leave a short backlog note.
