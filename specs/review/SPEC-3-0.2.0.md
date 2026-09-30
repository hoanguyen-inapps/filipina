---
review_of: SPEC-3
version: 0.2.0
reviewed_hash: sha256:a2765bf036cdc3dc38f7181e
---

# Review SPEC-3 0.2.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from 0.1.0, made to realize SPEC-9, and their fit with SPEC-4 and SPEC-9
- Files read: SPEC-9, the SPEC-3, SPEC-5, SPEC-6 and SPEC-7 revisions and their approved versions (diffed), SPEC-1, SPEC-2, SPEC-4, SPEC-8, BRIEF-1 C-30..C-40, SRC-27 in full, cited lines of SRC-1, SRC-3, SRC-12, SRC-15..SRC-20, SRC-24, reference/spec-logic.md
- The two CLARIFY markers in the SPEC-7 revision were known open questions and are not findings.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 13 | R-21 | 2 | Pending requests stay acceptable after removal; SPEC-4 not in the set | maria accepts at 10:05 after her only photo is removed | Fixed from SRC-28 W1: SPEC-4 revision R-24, X-11; SPEC-3 R-21; AC-68..AC-70 (SPEC-4) |
| 14 | R-21 | 1 / 2 | Knock-on effects beyond the source (Lobby access, search, cultural education); "Đã thích bạn" undefined | maria liked john before removal | Fixed from SRC-28 W2: R-21 lists every consequence, hidden from "Đã thích bạn"; AC-75 |
| 15 | R-10, DF-05 | 5 / 4 | completedAt on re-completion; partial-save clause unsourced | Photo re-added 2026-11-02 | Fixed from SRC-28 W3: R-10 completedAt kept; partial save confirmed; AC-70, AC-76 |
| 16 | R-22, DF-08 | 2 | Does an earlier open survive unpublish and republish | C unpublished then republished | Fixed from SRC-28 W4: R-22, DF-08; AC-77 |

Process note: SRC-27 is draft; it is approved together with SPEC-9 and the revisions (`--with-sources`).

Resolution: every finding changed the artifact or was confirmed by the owner (SRC-28, answered "theo đề xuất"). The changes were checked against SRC-28 by the drafting agent, not by a fresh reviewer.
