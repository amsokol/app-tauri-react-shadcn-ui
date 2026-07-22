# Release quarantine

**Approach:** see [`library/policy/quarantine.md`](library/policy/quarantine.md).
**Duration** is set only in this product overlay.

Keep duration aligned with `pnpm-workspace.yaml` (`minimumReleaseAge`).

## Duration (this product)

| Setting          | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Quarantine       | **2 days** (48 hours)                                                    |
| pnpm enforcement | `minimumReleaseAge: 2880` minutes in `pnpm-workspace.yaml` (same window) |

Do not lower or disable `minimumReleaseAge` unless the policy owner explicitly
overrides it here and in `pnpm-workspace.yaml` together.

Apply to every ecosystem listed in [`POLICY.md`](POLICY.md) (npm / pnpm, Cargo).

## Candidates (versions you might bump **to**)

1. Find publish time using the enabled ecosystem `publish-time.md` topics.
2. If `now - published < 2 days` → **wait** (do not bump).
3. Prefer the newest version that already cleared the window.
4. Unknown publish time → do not bump (treat as wait).

## Current pins (already in the tree)

If a **currently pinned** version is still younger than **2 days** → **FORBIDDEN**.

On maintain:

1. Open/update Issue per [`library/maintain/findings.md`](library/maintain/findings.md).
2. End final answer with: `AGENT_SIGNAL: policy-violation`
3. Do **not** “fix” by adopting an even newer pin inside the window. Prefer wait,
   or a documented security exception / older cleared pin when safe.

On gate (PR changes pins only):

- Introducing or keeping a pin younger than **2 days** on the PR → blocking /
  `AGENT_SIGNAL: policy-violation` (or `block` when REQUEST_CHANGES).

## Security exception

Document near the pin (see [`library/policy/holds.md`](library/policy/holds.md)) or in the Issue/PR body.
Exception must name the advisory / CVE and the pin.
