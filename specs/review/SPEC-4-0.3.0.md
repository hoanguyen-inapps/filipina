---
review_of: SPEC-4
version: 0.3.0
reviewed_hash: sha256:b591070183b33e23f517a7f8
---

# Review SPEC-4 0.3.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from the approved version, made to realize SPEC-8, and their fit with SPEC-8
- Files read: the four revisions and their approved versions (diffed), SPEC-8, SRC-24, SRC-25, BRIEF-1 C-30..C-40, reference/spec-logic.md; excerpts of SRC-6, SRC-7, SRC-8, SRC-10, SRC-11, SPEC-3, SPEC-6, SPEC-7

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 16 | R-19, R-13, R-21, DF-08 | 5 | Can the man request again after a revocation-ended connection | maria re-verified two days later | Fixed from SRC-26 U14: R-19 ends create no send ban; AC-67 |
| 17 | AC-65 | 6 | Man's side of a revocation untested | john revoked with a Pending request | Fixed: AC-66 |

Process note: SRC-24 and SRC-25 are approved together with SPEC-8 and the revisions (`--with-sources`).

Resolution: every finding changed the revision or was confirmed by the owner (SRC-26, answered "theo đề xuất"). The changes were checked against SRC-26 by the drafting agent, not by a fresh reviewer.
