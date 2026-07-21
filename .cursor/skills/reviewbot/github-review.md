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

## Resolve threads (mandatory on recheck)

When a prior **reviewbot** finding is fixed on the current head (including when
GitHub already shows the comment as **Outdated** because the lines moved/deleted):

1. Reply on the thread: `reviewbot: fixed — <brief evidence>`
2. **Always** Resolve conversation via GraphQL (do not leave open/outdated):

```bash
# List review threads (need GraphQL node ids)
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

# Resolve one thread
gh api graphql -f query='
mutation($id:ID!) {
  resolveReviewThread(input:{threadId:$id}) {
    thread { id isResolved }
  }
}' -f id='PRRT_…'
```

Skip resolve only if GraphQL fails after retry — then say so in the summary
(expected with default `GITHUB_TOKEN`: `Resource not accessible by integration`).
In CI set secret `REVIEWBOT_GH_TOKEN` (PAT with Pull requests: write) so resolve
works. Outdated ≠ resolved: you must still attempt resolve for fixed threads.

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
