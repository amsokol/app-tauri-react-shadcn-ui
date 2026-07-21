# PR lifecycle (fix track)

Idempotent: one open fix PR, no empty pushes.

| Track | Branch             | Label     | Contents                        |
| ----- | ------------------ | --------- | ------------------------------- |
| fix   | `security/vulnbot` | `vulnbot` | Verified safe remediations only |

## Sync strategy (hybrid)

| Situation                  | Strategy                            |
| -------------------------- | ----------------------------------- |
| No open PR                 | Recreate from `origin/main`         |
| Open PR, healthy           | Merge `origin/main` **before** scan |
| Open PR + recreate trigger | Close PR + recreate from `main`     |

### Recreate triggers

1. Merge conflict with `origin/main`
2. Branch tip **> 14 days** behind `origin/main`
3. Previous run blocked / branch unusable
4. Explicit recreate request
5. Missing or corrupted track branch

On recreate: comment `vulnbot: superseded — recreating track from main (<reason>)`.

## Algorithm

1. `git fetch origin`. Find open PR (`vulnbot` + `security/vulnbot`).
2. Recreate if triggered; else merge `origin/main` before scan.
3. Scan / cluster / issues.
4. Apply only verified safe fixes → commit → push → create/update PR.
5. No eligible fix → noop (still update issues).

## Force-push

Only with **no** open `vulnbot` PR when replacing `security/vulnbot` from `main`.

## Report

```markdown
## PR lifecycle

- Track: fix (`security/vulnbot`)
- Strategy: merge-first | recreate | n/a
- Action: created / updated / noop / recreated / blocked
- PR: URL or none
- Issues: list of URLs
```
