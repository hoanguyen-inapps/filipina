---
review_of: SPEC-5
version: 0.3.0
reviewed_hash: sha256:b2284f549949ad53cd60c2f8
---

# Review SPEC-5 0.3.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from 0.2.0, made to realize SPEC-9, and their fit with SPEC-9
- Files read: SPEC-9, the SPEC-3, SPEC-5, SPEC-6 and SPEC-7 revisions and their approved versions (diffed), SPEC-1, SPEC-2, SPEC-4, SPEC-8, BRIEF-1 C-30..C-40, SRC-27 in full, cited lines of SRC-1, SRC-3, SRC-12, SRC-15..SRC-20, SRC-24, reference/spec-logic.md
- The two CLARIFY markers in the SPEC-7 revision were known open questions and are not findings.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 17 | R-20 | 5 / 3 | term and lockedPrice copied after a term change mismatch | 1 month at 399,00 | Fixed from SRC-28 W18: R-20 term and price of the late Payment; AC-69 |
| 18 | R-20 | 4 / 2 | Payment re-linked to the new Subscription unsourced; member not told | john buys again and is refused | Fixed from SRC-28 W19: R-20 Payment re-link confirmed, receipt email (R-15); AC-64 |
| 19 | R-06, DF-08 | 2 | No path for a rejected refund; flag closes on send | Rejected 129,00 refund blocks the Payment | Fixed from SRC-28 W12: DF-08 rejected status, R-06; SPEC-9 R-04, R-06; AC-67 (SPEC-5), AC-68, AC-69 (SPEC-9) |
| 20 | Scope; SPEC-6 Scope, SPEC-6/R-11 | 3 | Stale "SPEC admin" and "nội dung do khách cung cấp" texts | Scope says admin acts for the man | Fixed: SPEC-5 Scope, SPEC-6 Scope and R-11 updated |

Process note: SRC-27 is draft; it is approved together with SPEC-9 and the revisions (`--with-sources`).

Resolution: every finding changed the artifact or was confirmed by the owner (SRC-28, answered "theo đề xuất"). The changes were checked against SRC-28 by the drafting agent, not by a fresh reviewer.
