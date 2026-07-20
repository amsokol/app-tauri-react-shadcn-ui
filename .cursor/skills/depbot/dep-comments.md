# Dependency comments

Treat comments near dependency pins as first-class policy. Never skip the comment pass.

## Where to look

- `pnpm-workspace.yaml` catalog entries and lines above them
- `package.json` (rare; versions usually via `catalog:`)
- `src-tauri/Cargo.toml` and a few lines above each dep
- Nearby `#` / `//` comments
- Search: `depbot:`, `bundle`, `hold`, `pin`, `do not bump`, `until`, `when`, `lockstep`, `aligned`

## Preferred markers

```toml
# depbot: hold tag v3.3.2 — do not bump to v3.4.x until macOS TLS crash is fixed upstream
mimalloc = { git = "https://github.com/amsokol/mimalloc", tag = "v3.3.2" }
```

```yaml
# depbot: bundle tauri-stack — keep @tauri-apps/api, @tauri-apps/cli, and Cargo tauri aligned
# depbot: ok to patch/minor within 2.x; majors only with explicit approval
"@tauri-apps/api": =2.11.1
```

| Phrase                               | Meaning                                                                     |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `hold` / `pin` / `do not bump`       | Block bumps unless condition met or user overrides                          |
| `bundle <id>`                        | Coupled set — see `coupled-deps.md`                                         |
| `bump to X when …` / `until …`       | Target + unlock condition                                                   |
| `bump bundle to X when ALL …`        | Every listed condition must pass before any member bumps                    |
| `ok to patch` / `patch only`         | Cap at patch (or patch+minor if said)                                       |
| `security ok` / `security exception` | May bypass a soft hold **and** the 2-day quarantine (still report override) |

Natural-language notes without `depbot:` still count if clearly about that pin.

## Reconcile

1. Collect holds / unlocks / bundles.
2. Scan outdated versions.
3. Candidate bump only if unlock is satisfied (for bundles: **all** members/conditions)
   **and** the target version cleared the **2-day quarantine** (`quarantine.md`).
4. Unmet hold on any bundle member → block the **whole** bundle.
5. Version too fresh → **wait** (quarantine); do not treat as unlock failure unless a hold also applies.
6. After a successful unlock bump, refresh or remove stale `depbot:` comments.

## Reporting

```markdown
## Dependency comments

- `mimalloc` held at `v3.3.2` — unlock: … (met / unmet)

## Coupled bundles

- `tauri-stack`: … → bump bundle / blocked
```

Dry-run still requires this section when comments exist.

## Anti-patterns

- Ignoring comments because outdated looks noisy
- Bumping past an explicit hold “to help”
- Leaving obsolete unlock comments after the bump landed
- Bumping one member of a coupled set alone
