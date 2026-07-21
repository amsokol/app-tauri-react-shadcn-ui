# GitHub review mechanics

Identity marker (first line of every review body):

```text
reviewbot: review
```

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

## Resolve threads

Fixed prior finding → reply `reviewbot: fixed — <evidence>` → resolve thread
(GraphQL `resolveReviewThread` when possible).

## Decision matrix

| Situation                             | Action            |
| ------------------------------------- | ----------------- |
| Draft                                 | Skip              |
| Blocking findings remain              | `REQUEST_CHANGES` |
| No open bot threads + no new blocking | `APPROVE`         |
| Summary only                          | `COMMENT`         |

## APPROVE rules

1. Diff read this run
2. All open reviewbot threads resolved (or none)
3. No new blocking findings

Requires Actions setting: allow approve pull requests.
