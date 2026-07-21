# Findings (issues)

## Severity

| Level    | Meaning                                             |
| -------- | --------------------------------------------------- |
| critical | Actively exploitable / RCE / secret exposure        |
| high     | Serious impact with plausible exploit path          |
| medium   | Limited impact or harder exploit                    |
| low      | Defense-in-depth / informational                    |

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

## Close criteria

Close when advisory is gone after fix merge, or risk accepted by maintainers.
