# Review rubric

Focus: `src/`, `src-tauri/`, `package.json` / catalog, `.github/`,
`.cursor/skills/`.

## Always check

| Theme              | Look for                                                   |
| ------------------ | ---------------------------------------------------------- |
| Correctness        | UI/logic regressions; broken Tauri commands                |
| Security           | IPC sanitization, XSS, path traversal, secrets in renderer |
| Rust / JS boundary | Unsafe assumptions across invoke payloads                  |
| Deps               | Accidental major bumps; lockfile-only noise vs real need   |
| Hygiene            | Unrelated refactors; debug leftovers                       |

## Severity

| Level        | Review effect                                |
| ------------ | -------------------------------------------- |
| blocking     | `REQUEST_CHANGES`                            |
| non-blocking | `COMMENT` only; does not block APPROVE alone |

Prefer non-blocking unless clear break or security issue.
