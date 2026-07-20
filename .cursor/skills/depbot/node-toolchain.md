# Node toolchain (single version)

**Hard policy:** this repo uses **one Node major everywhere** — currently **Node 24**.

Only a **human** (repo owner) may raise the Node major/line. Depbot must **never**
bump Node toolchain pins. If pins disagree, that is a **FORBIDDEN** drift signal.

## Canonical sources (must agree on major 24)

| Location                        | Expected                                       | Notes                                                                                                                |
| ------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `.nvmrc`                        | `24`                                           | Canonical for local + CI                                                                                             |
| `.node-version`                 | `24`                                           | Must match `.nvmrc`                                                                                                  |
| `package.json` → `engines.node` | major **24** (e.g. `>=24.13.0`)                | Floor may have a patch; major must stay 24 until human bumps                                                         |
| `.github/workflows/*`           | `node-version-file: .nvmrc` (or explicit `24`) | Do not introduce a second hardcoded major                                                                            |
| catalog `@types/node`           | **24.x**                                       | Types major follows Node major; patch/minor of `@types/node` may move under quarantine rules, but **not** to 22/25/… |

If a new file pins Node (Volta, `.tool-versions`, Dockerfile, docs badges), it must
follow the same major — include it in the drift check when present.

## Depbot must not

- Change `.nvmrc`, `.node-version`, or `engines.node` major/line.
- Switch CI off `node-version-file: .nvmrc` onto another major.
- Bump `@types/node` to a **different major** than Node (e.g. 25 while toolchain is 24).
- “Helpfully” align drift by bumping Node upward — **signal only**; human decides.

## Drift detection (mandatory each run)

Compare majors across the canonical sources. Any mismatch → **FORBIDDEN**.

Examples of violations:

- `.nvmrc` = `24`, `.node-version` = `22`
- `.nvmrc` = `24`, `engines.node` = `>=20` or `>=25`
- CI uses `node-version: 20` while `.nvmrc` is `24`
- `@types/node` catalog major `22` while Node is `24`

## Reporting

When drift exists, lead near the top of the plan (with quarantine violations):

```markdown
## Node toolchain violations (FORBIDDEN)

> Policy: single Node major (24) everywhere; only a human may raise it.

| Source          | Value     | Expected    | Status    |
| --------------- | --------- | ----------- | --------- |
| `.nvmrc`        | 24        | 24          | ok        |
| `.node-version` | 22        | 24          | **DRIFT** |
| `engines.node`  | >=24.13.0 | major 24    | ok        |
| CI setup-node   | .nvmrc    | .nvmrc / 24 | ok        |
| `@types/node`   | =24.13.3  | major 24    | ok        |

**Next:** human aligns pins manually. Depbot will not bump Node.
```

When everything matches, a one-liner is enough:

```markdown
## Node toolchain

- Node **24** consistent (`.nvmrc`, `.node-version`, `engines.node`, CI, `@types/node`)
```

## Relation to quarantine

- Node **toolchain** files: human-only; not subject to routine depbot bumps.
- `@types/node` **patch/minor within 24.x**: normal catalog rules + 2-day quarantine.
- `@types/node` **major ≠ 24**: toolchain violation, not a normal bump candidate.
