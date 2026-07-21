# GitHub review mechanics

Identity marker (first line of every review body):

```text
reviewbot: review
```

## Tokens (CI)

- `GH_TOKEN` — reviews / APPROVE / comments (`github.token` → bot)
- `REVIEWBOT_GH_TOKEN` — **only** GraphQL `resolveReviewThread` (classic PAT)

Never set `GH_TOKEN` to a user PAT in CI: reviews appear as that user, and
GitHub refuses **APPROVE** on the author's own PRs.

## Commands

```bash
PR="$REVIEWBOT_PR"

gh pr view "$PR" --json number,title,isDraft,url,headRefOid,author
gh pr diff "$PR"
gh api "repos/{owner}/{repo}/pulls/$PR/reviews" --paginate
gh api "repos/{owner}/{repo}/pulls/$PR/comments" --paginate

gh pr review "$PR" --request-changes --body "…"
gh pr review "$PR" --comment --body "…"
gh pr review "$PR" --approve --body "…"
```

Inline: API `pulls/{pr}/comments` or review `comments[]`. Prefer line comments
for blocking items.

## Resolve threads (mandatory on recheck)

When a prior **reviewbot** finding is fixed on the current head (including when
GitHub already shows the comment as **Outdated** because the lines moved/deleted):

1. Reply on the thread: `reviewbot: fixed — <brief evidence>`
2. **Always** Resolve conversation via GraphQL (do not leave open/outdated).
   Use `REVIEWBOT_GH_TOKEN` when set (do not use default `GH_TOKEN` for this
   mutation):

```bash
# List review threads (need GraphQL node ids) — GH_TOKEN is fine for reads
gh api graphql -f query='
query($owner:String!,$name:String!,$number:Int!) {
  repository(owner:$owner, name:$name) {
    pullRequest(number:$number) {
      reviewThreads(first:100) {
        nodes {
          id
          isResolved
          isOutdated
          comments(first:20) {
            nodes { author { login } body databaseId }
          }
        }
      }
    }
  }
}' -F owner='{owner}' -F name='{repo}' -F number="$PR"

# Resolve one thread — prefer classic PAT
RESOLVE_TOKEN="${REVIEWBOT_GH_TOKEN:-$GH_TOKEN}"
GH_TOKEN="$RESOLVE_TOKEN" gh api graphql -f query='
mutation($id:ID!) {
  resolveReviewThread(input:{threadId:$id}) {
    thread { id isResolved }
  }
}' -f id='PRRT_…'
```

Skip resolve only if GraphQL fails after retry — then say so in the summary.

Expected failures:

- `GITHUB_TOKEN` only: `Resource not accessible by integration`
- Fine-grained PAT: `Resource not accessible by personal access token`  
  → use a **classic** PAT with scope **`repo`** as `REVIEWBOT_GH_TOKEN`

Outdated ≠ resolved: you must still attempt resolve for fixed threads.

## Decision matrix

| Situation                                   | Action            |
| ------------------------------------------- | ----------------- |
| Draft                                       | Skip              |
| Blocking findings remain                    | `REQUEST_CHANGES` |
| No unresolved bot threads + no new blocking | `APPROVE`         |
| Summary only                                | `COMMENT`         |

## APPROVE rules

1. Diff read this run
2. All reviewbot threads are **resolved** (not merely outdated)
3. No new blocking findings

Requires Actions setting: allow approve pull requests.
