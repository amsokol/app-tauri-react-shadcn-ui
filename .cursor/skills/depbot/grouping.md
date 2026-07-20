# Grouping policy

How to split dependency updates into reviewable units.

## Prefer

- **Patch / minor** of the same ecosystem together when low-risk.
- **One PR per major** of high-impact packages (Tauri, React, Vite, TypeScript).
- **Security** soonest; may be its own PR.
- **Same reason together** (e.g. all ESLint-related catalog minors).

## Avoid

- Mixing unrelated pnpm catalog bumps with Cargo majors in one PR unless the user asks.
- Bundling a major with dozens of unrelated patches.
- Touching app UI/logic “while we’re here”.
- Editing `src/components/ui/` as part of routine bumps (regenerate via shadcn CLI only if a bump requires it and the user asked).

## Risk tiers

| Tier | Examples | Default |
|------|----------|---------|
| Low | prettier, stylelint, knip, types packages (patch) | Group freely |
| Medium | eslint plugins, vite plugins, small libs | Small groups; skim changelog |
| High | `tauri*`, `react`, `vite`, `typescript`, mimalloc | Separate PR; read notes |

## Bundles vs PR groups

- **Bundle** (`coupled-deps.md`) = must land together atomically.
- **PR group** = review packaging. Default: **one PR per unlocked high-risk bundle**.

## Huge lists

1. Prioritize: security → patch → minor → selected majors.
2. Execute only the agreed batch.
3. Leave a short backlog note.
