# Quarantine (this product)

Approach: [`library/policy/quarantine.md`](library/policy/quarantine.md).

| Setting          | Value                                                                    |
| ---------------- | ------------------------------------------------------------------------ |
| Quarantine       | **2 days** (48 hours)                                                    |
| pnpm enforcement | `minimumReleaseAge: 2880` minutes in `pnpm-workspace.yaml` (same window) |

Do not lower or disable `minimumReleaseAge` unless updated here and in
`pnpm-workspace.yaml` together.

Apply to every ecosystem listed in [`POLICY.md`](POLICY.md).
