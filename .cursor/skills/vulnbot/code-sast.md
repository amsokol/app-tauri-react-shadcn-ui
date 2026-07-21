# Code / SAST

Two layers — **both required** every run:

1. **Tools** — existing repo scripts.
2. **LLM review** — you personally read application source and look for vulns.
   Do not stop after linters pass; green lint ≠ no security issues.

## 1) Tool pass

```bash
pnpm lint          # eslint
pnpm lint:rust     # cargo clippy -D warnings
pnpm typecheck
```

Optional focus (time-boxed OK): security-relevant eslint/clippy diagnostics.

## 2) LLM security review (mandatory)

Read real source under `src/`, `src-tauri/`, and related config. Prioritize:

- Command injection / unsanitized Tauri IPC payloads
- Path traversal on file APIs
- Secret leakage in renderer logs
- Dangerous `dangerouslySetInnerHTML` / open redirects
- Authz gaps on privileged commands
- Unsafe shell / `eval` / dynamic code

**Quality bar:** concrete path (+ line when possible), short why, severity per
`findings.md`. Mark Evidence as `llm-review` (vs tool rule id). Prefer real
issues over speculative noise. Redact secrets in issues.

Merge tool + LLM findings; dedupe before opening issues.

Do not install new SAST products or ESLint plugins for this run.

## Report table

```markdown
| Severity | Source (tool \| llm-review) | Rule / theme | Path | Evidence | Fix eligible |
| -------- | --------------------------- | ------------ | ---- | -------- | ------------ |
```
