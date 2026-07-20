# Rust toolchain (patch bumps on daily track)

**Policy:** keep **one exact Rust version** everywhere it is pinned.

| Change                            | Depbot                                                 |
| --------------------------------- | ------------------------------------------------------ |
| **Patch** `1.97.0` → `1.97.1`     | **Yes** — daily track (after 2-day quarantine)         |
| **New train** `1.97.x` → `1.98.0` | **No** — report / backlog; only with explicit human OK |

Unlike Node, depbot **may** bump Rust **patches**. New stable trains (middle number)
are human-gated.

## Canonical sources (must stay identical)

| Location                                     | Field / value            |
| -------------------------------------------- | ------------------------ |
| `rust-toolchain.toml`                        | `channel = "X.Y.Z"`      |
| `src-tauri/Cargo.toml`                       | `rust-version = "X.Y.Z"` |
| `.github/actions/setup-toolchain/action.yml` | `toolchain: "X.Y.Z"`     |

Treat these three as a **lockstep bundle**: bump all together or none.

If they disagree → **FORBIDDEN** drift (same severity as Node drift). Do not “fix”
by picking an arbitrary version without a cleared candidate; report and align only
when shipping an eligible patch (or when the user asks).

Also update the composite action **description** line if it hardcodes the train
(e.g. “Rust 1.97”) so docs match.

## Scan

1. Read current `channel` from `rust-toolchain.toml`.
2. Find the newest **same X.Y.\*** patch on the stable channel that has cleared
   quarantine (publish/release age ≥ 2 days). Sources:
   - `https://static.rust-lang.org/dist/channel-rust-1.Y.toml` (or current train), or
   - GitHub `rust-lang/rust` release / tag date for `1.Y.Z`
3. If only a newer train exists (`1.(Y+1).0`) → **backlog / blocked** (not daily).

## Apply (daily ship)

1. Set the same `X.Y.Z` in all three canonical files.
2. Re-verify with the new toolchain (`verify-migrate.md` daily ladder + rust lint).

## Depbot must not

- Jump to a new stable train without explicit user OK.
- Change only one of the three pins.
- Use `stable` / `beta` / `nightly` channel strings — keep an **exact** `X.Y.Z`.

## Reporting

```markdown
## Rust toolchain

| Source                  | Current | Candidate | Quarantine | Action        |
| ----------------------- | ------- | --------- | ---------- | ------------- |
| rust-toolchain.toml     | 1.97.0  | 1.97.1    | cleared    | bump (daily)  |
| Cargo.toml rust-version | 1.97.0  | 1.97.1    | (same)     | lockstep      |
| setup-toolchain         | 1.97.0  | 1.97.1    | (same)     | lockstep      |
| train 1.98.0            | —       | 1.98.0    | —          | blocked / OK? |
```

When already newest patch and no drift: one-liner is enough.
