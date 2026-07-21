# Findings (issues)

## Severity

| Level    | Meaning                                      |
| -------- | -------------------------------------------- |
| critical | Actively exploitable / RCE / secret exposure |
| high     | Serious impact with plausible exploit path   |
| medium   | Limited impact or harder exploit             |
| low      | Defense-in-depth / informational             |

Use `pnpm audit` / RustSec severity when available.

## Clustering

One GitHub issue per cluster (same package+advisory family, or same code hotspot).

## Idempotent issue keys

Title format:

```text
vulnbot: <ecosystem|code> — <short stable key>
```

Examples:

- `vulnbot: pnpm — <pkg> <GHSA-…>`
- `vulnbot: cargo — <crate> RUSTSEC-…`
- `vulnbot: code — Tauri IPC unsanitized input`

Search open issues with label `vulnbot` before creating; update body if found.

Labels: `vulnbot` (required).

## Issue body template

```markdown
## Finding

- Severity:
- Source: deps | code
- Tool / advisory:
- Affected:

## Evidence

(command output / snippet — redacted secrets)

## Remediation

- Proposed fix:
- Fix PR eligible: yes | no | blocked (reason)

## Status

- First seen:
- Last scan:
- Mitigation / accepted risk:
```

## Close criteria (ship — mandatory reconcile)

**Source of truth = the current working tree only** (this checkout / `cwd` /
`GITHUB_SHA` / PR head). Do **not** use `origin/main`, the default branch, or
another ref to decide that a finding is gone.

After each ship scan:

1. Confirm which ref you scanned (`git rev-parse HEAD`, branch/PR). Put it in
   the close comment.
2. List open issues with label `vulnbot` (`gh issue list --label vulnbot --state open`).
3. Match each issue to the current findings table by stable title key / advisory id.
4. Close **only** if the finding is absent from **this** tree (re-read the paths
   in the issue; re-run the audit command on this checkout):
   - Comment: `vulnbot: resolved — finding no longer present (<scan date>, HEAD=<sha>). <brief evidence from this tree>`
   - Close the issue.
5. If still present on this tree → update body (Last scan + status); leave open.
6. Never close because “main is clean” while scanning a PR/feature checkout.
7. Do **not** auto-close solely for “accepted risk” chat unless the issue already
   documents maintainer accepted risk as the resolution.

Dry-run: report which issues _would_ close; do not close.

## CI gate signals

Emit at the end of the report (exact lines):

| Condition                                                               | Line                               | Runner effect                      |
| ----------------------------------------------------------------------- | ---------------------------------- | ---------------------------------- |
| ≥1 actionable finding still present (even if fix PR / blocked upstream) | `VULNBOT_SIGNAL: findings-present` | notice only — **does not** fail CI |
| Critical without fix/mitigation                                         | `VULNBOT_SIGNAL: critical-unfixed` | **fails** CI (exit 4)              |
| Clean scan                                                              | _(no signal lines)_                | pass                               |

Always open/update issues for actionable findings (all severities).
