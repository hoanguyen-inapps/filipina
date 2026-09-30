---
review_of: SPEC-7
version: 0.2.0
reviewed_hash: sha256:6b3fda92c3e15e7d23fd6df7
---

# Review SPEC-7 0.2.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from 0.1.0, made to realize SPEC-9, and their fit with SPEC-9
- Files read: SPEC-9, the SPEC-3, SPEC-5, SPEC-6 and SPEC-7 revisions and their approved versions (diffed), SPEC-1, SPEC-2, SPEC-4, SPEC-8, BRIEF-1 C-30..C-40, SRC-27 in full, cited lines of SRC-1, SRC-3, SRC-12, SRC-15..SRC-20, SRC-24, reference/spec-logic.md
- The two CLARIFY markers in the SPEC-7 revision were known open questions and are not findings.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 23 | F-01 | 3 | Flow still lists email for (5), (6), (7), (9) only | Event (10) email missing from flow | Fixed: F-01 step 2 |
| 24 | R-05, N-01 | 4 | Push for (11) shows only the event type; 60 s target for a broadcast (inference) | 10 000 members, "New announcement" | Fixed from SRC-28 W22: R-05 push shows the title; N-01 excludes (11), N-02 ≤ 5 min; AC-48, AC-53 |
| 25 | R-01, AC-47 | 2 | Removal during suspension is never told | maria reinstated, profile hidden | Fixed from SRC-28 W23: R-01 event (10) delivered when standing returns to Good; AC-47 |

The two CLARIFY markers were answered in SRC-28 W24 (R-09, AC-51) and W25 (R-15, AC-52).

Process note: SRC-27 is draft; it is approved together with SPEC-9 and the revisions (`--with-sources`).

Resolution: every finding changed the artifact or was confirmed by the owner (SRC-28, answered "theo đề xuất"). The changes were checked against SRC-28 by the drafting agent, not by a fresh reviewer.
