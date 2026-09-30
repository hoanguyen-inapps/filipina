---
review_of: SPEC-1
version: 0.2.0
reviewed_hash: sha256:e5954a3ccd4b71bfc776439e
---

# Review SPEC-1 0.2.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from the approved version, made to realize SPEC-8, and their fit with SPEC-8
- Files read: the four revisions and their approved versions (diffed), SPEC-8, SRC-24, SRC-25, BRIEF-1 C-30..C-40, reference/spec-logic.md; excerpts of SRC-6, SRC-7, SRC-8, SRC-10, SRC-11, SPEC-3, SPEC-6, SPEC-7

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 11 | R-19, X-06 | 2 / 5 | Admin deletion of an Unconfirmed account past the 168 h mark | Delete at 168 h before cleanup | Fixed from SRC-26 U9: R-19 refuses Unconfirmed past 168 h (treated as Expired); AC-115 |
| 12 | AC-113, AC-114, R-19 | 6 | ACs lack reference and reason; no AC for already-Deleted or double delete | Two admins delete 50 ms apart | Fixed from SRC-26 U10: AC-113, AC-114 carry reference and reason; R-19 first write wins; AC-116, AC-117 |

Process note: SRC-24 and SRC-25 are approved together with SPEC-8 and the revisions (`--with-sources`).

Resolution: every finding changed the revision or was confirmed by the owner (SRC-26, answered "theo đề xuất"). The changes were checked against SRC-26 by the drafting agent, not by a fresh reviewer.
