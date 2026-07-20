# Release quarantine (cooldown)

**Hard policy for this repo:** only adopt a version that has been published for
**at least 2 days** (48 hours). Newer releases are **in quarantine** — report them,
do not bump to them.

Having a **currently pinned** version that is still younger than 2 days is also
**forbidden** (policy violation). Depbot must **always signal** it — never ignore.

This applies to **every** ecosystem depbot touches (pnpm catalog, Cargo crates,
git tags), not only packages where the package manager enforces it.

## Duration

| Setting | Value |
|---------|-------|
| Quarantine | **2 days** (48 hours) |
| pnpm enforcement | `minimumReleaseAge: 2880` minutes in `pnpm-workspace.yaml` (same window) |

Do **not** lower or disable `minimumReleaseAge` unless the user explicitly overrides.

## How to decide (candidates)

For a candidate version `X` you might bump **to**:

1. Find **publish / release time** (registry `created`/`published_at`, GitHub release
   `published_at`, git tagger/commit date for tag pins).
2. If `now - published_at < 2 days` → status **quarantine** → action **skip / wait**.
3. If several newer versions exist, pick the **newest that already cleared** quarantine
   (not “latest at any cost”).
4. If publish time cannot be determined → treat as **quarantine / not confirmed**;
   do not bump. Cite what you checked.

## Already pinned too fresh (forbidden)

During discover / scan, check **current** pins in `pnpm-workspace.yaml` catalog and
`src-tauri/Cargo.toml` (and resolved lock versions when they differ from the pin).

If a **currently installed / catalog-pinned** version has `published_at` younger than
2 days:

| Field | Value |
|-------|--------|
| Status | **`FORBIDDEN`** — quarantine policy violated |
| Signal | Mandatory section **Quarantine violations** (see below); call out in the first lines of the plan |
| Default action | **Propose rollback** to the newest version of that package that already cleared 2 days (or previous pin if known). Do **not** silently accept. |
| Dry-run | Report violation + proposed rollback; do not mutate unless the user asked to fix. |
| Apply / PR | Only roll back when the user asked to fix violations (or “fix quarantine” / “ship remediation”). Separate small PR preferred. |
| Do not | Bump *further* onto another still-quarantined version; hide the issue in a routine bump PR. |

Exceptions (still **must** list under violations with `exception:` reason):

- User explicitly approved keeping the fresh pin, **or**
- `depbot: security ok` / `security exception` on that line for this version.

Unknown publish time on a current pin → treat as **FORBIDDEN / not confirmed** until age is proven ≥ 2 days (or user waives).

## Bundles

A coupled bundle may bump only when **every** member’s target version has cleared
quarantine (and other unlock conditions). If one member is still too fresh →
**whole bundle blocked**.

If any **current** bundle member is already a forbidden fresh pin → flag the **bundle**
under violations; remediation should move members together when rolling back.

## Security exceptions

Critical security fixes may bypass quarantine **only** when:

- the user explicitly allows it, **or**
- a `depbot: security ok` / `security exception` comment is on that pin,

and you still **report** that quarantine was overridden and why (both for new bumps
and for keeping an already-fresh pin).

## Reporting

### Candidates filtered by age

```markdown
## Quarantine (2 days)
| Package | Candidate | Published | Age | Action |
|---------|-----------|-----------|-----|--------|
| vite | 8.2.0 | 2026-07-20 | < 2d | wait |
| react | 19.2.8 | 2026-07-17 | ≥ 2d | eligible |
```

### Already-pinned violations (mandatory if any)

Lead with a clear alert when this section is non-empty:

```markdown
## Quarantine violations (FORBIDDEN)

> Policy breach: pinned versions younger than 2 days are not allowed.

| Package | Pinned now | Published | Age | Proposed fix |
|---------|------------|-----------|-----|--------------|
| some-lib | =1.2.3 | 2026-07-20 | < 2d | rollback to =1.2.2 (cleared) |

**Next:** ask to open a remediation PR, or confirm an explicit exception.
```
