# pnpm (catalog)

This repo pins versions in **`pnpm-workspace.yaml` → `catalog:`**.
`package.json` mostly uses `"pkg": "catalog:"` — **bump the catalog**, not ad-hoc ranges in `package.json`.

## Detect

- Root `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- `engines.node` and `.nvmrc` / `.node-version` — **Node toolchain** (`node-toolchain.md`);
  drift is FORBIDDEN; depbot never bumps Node major/line

## Scan

Prefer:

```bash
pnpm outdated
```

Also useful:

```bash
pnpm audit
```

Map outdated names back to **catalog keys** in `pnpm-workspace.yaml`.

Do not treat Node toolchain files as catalog bumps — see `node-toolchain.md`.
`@types/node` may move within major **24** under quarantine rules; major drift is FORBIDDEN.

## Supply-chain cooldown (quarantine)

**Mandatory:** only bump to versions at least **2 days** old — see `quarantine.md`.

Repo config (do not weaken without explicit user OK):

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 2880   # 2 days, in minutes
```

- `pnpm outdated` / install respect this when the feature applies; still **verify publish age**
  for candidates you propose (and for any path that might bypass the setting).
- **Audit current catalog pins** for age; too-fresh pins → **FORBIDDEN** (`quarantine.md`).
- If the newest version is in quarantine, propose the newest version that **already cleared**
  2 days, or list the fresh one under **Quarantine → wait**.
- Never pass flags / config that disables `minimumReleaseAge` unless the user asks.

## Apply

1. Update version(s) under `catalog:` in `pnpm-workspace.yaml` (keep `=` exact pins unless comments say otherwise).
2. `pnpm install` to refresh `pnpm-lock.yaml`.
3. Do not introduce non-catalog pins in `package.json` without a reason.

## Verify (lightest meaningful)

```bash
pnpm typecheck
pnpm lint
# or broader if the bump is high-risk:
pnpm lint:all
pnpm build
```

## Reporting

```markdown
## pnpm catalog
| Package | Catalog pin | Available | Quarantine | Action |
|---------|-------------|-----------|------------|--------|
| react | =19.2.7 | … | cleared / wait | hold / bump / skip |
```
