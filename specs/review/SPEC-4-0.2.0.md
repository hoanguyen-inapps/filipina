---
review_of: SPEC-4
version: 0.2.0
reviewed_hash: sha256:67281f1a2d175e92f12f78df
---

# Review SPEC-4 0.2.0 (revision of 0.1.0)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Scope: the changes from 0.1.0 (DF-08, X-09, X-10, R-17, R-21, R-22, AC-53..AC-56) and their fit with SPEC-4 and SPEC-6
- Files read: SPEC-4 0.2.0 revision, SPEC-4 0.1.0, BRIEF-1, SRC-20, SPEC-6, cited lines of SRC-15, SRC-16, SRC-19, reference/spec-logic.md
- Source check: every new statement traces to SRC-20#L22, SRC-20#L39 or SRC-20#L43; none says more than the source.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-22, DF-08 | 5 / 2 | Does the permanent ban apply to a block made with no request and no connection | john blocks anna seen only in search, unblocks, sends a first request | Fixed from SRC-21 M1: R-22 covers every block; AC-59 |
| 2 | R-08, R-21 vs R-22 | 3 (inference) | Withdrawn or naturally Expired request followed by a block and unblock | Withdraw, block, unblock, send after 30 days | Fixed from SRC-21 M2: R-22 replaces the 30-day and 720-hour windows; AC-60 |
| 3 | R-21 vs SPEC-6 R-02 | 3 | What the man sees for a block-expired request while the block is Active and after | john opens his request list during maria's block | Fixed from SRC-21 M3: R-21; AC-61 |
| 4 | X-09, X-10, R-18 | 2 | Block racing accept, withdraw, decline or end; SPEC-6 R-18 read literally refuses the block | Accept at .050, block at .100 | Fixed from SRC-21 M4: R-22 applies the block to the latest state; SPEC-6 R-18 aligned; AC-62 |
| 5 | X-09 | 2 | Block after the 336-hour mark before the expiry is recorded | Block at 336 h + 2 min | Fixed from SRC-21 M5: X-09 guard not R-06; AC-63 |
| 6 | AC-53..AC-56 | 6 | Man-blocks-Pending and woman-blocks-Open cases missing; AC-56 passes through R-13 | Ban only when the woman blocks | Fixed from SRC-21 M6: AC-57, AC-58 |
| 7 | R-22 | 2 / 5 | Refusal message after unblock may reveal the block | Block-specific message | Fixed from SRC-21 M7: R-23; AC-64 |

Gaps without behaviour change: F-01 and F-02 steps, Scope, DF-03 and DF-05 constraints now mention R-22. Out of scope is unchanged and still correct (the blocking feature itself lives in SPEC-6). The 0.2.0 change-log row is written at approval.

## Top three

1. Scope of the permanent ban (#1, #2).
2. Block racing another action (#4).
3. The man's view of a block-expired request (#3).

Resolution: all 7 findings changed the revision (SRC-21, answered "theo đề xuất"). The changes were checked against SRC-21 by the drafting agent, not by a fresh reviewer.
