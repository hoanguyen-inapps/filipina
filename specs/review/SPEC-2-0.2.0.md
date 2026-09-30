---
review_of: SPEC-2
version: 0.2.0
reviewed_hash: sha256:42e6e7d2c586fc886d0a6aa4
---

# Review SPEC-2 0.2.0 (revision)

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the changes from the approved version, made to realize SPEC-8, and their fit with SPEC-8
- Files read: the four revisions and their approved versions (diffed), SPEC-8, SRC-24, SRC-25, BRIEF-1 C-30..C-40, reference/spec-logic.md; excerpts of SRC-6, SRC-7, SRC-8, SRC-10, SRC-11, SPEC-3, SPEC-6, SPEC-7

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-25, X-21..X-24 | 1 | Ban cancels Declined and Applying files; source says only pending files | Declined john banned | Fixed from SRC-26 U1: R-25 ban cancels only Submitted/AwaitingAdmin and Applying/InProgress/ReportReceived; X-23 removed; AC-118 |
| 2 | S-06, S-13, R-25 vs SPEC-8/R-10 | 2 / 3 | Accepted ban appeal leaves verification in terminal Cancelled | AC-27 then AC-37 | Fixed from SRC-26 U2: S-06, S-13 normal; DF-21 cancelledByBan; X-27, X-28; R-32; AC-120, AC-121 |
| 3 | R-31 | 1 / 4 | Both Cấp cao nhất and Xác minh required is an inference | top1 with only Cấp cao nhất overrides | Confirmed from SRC-26 U3: both roles; R-31 |
| 4 | Out of scope | 3 | Still says Approved is final and sends grant, override, revoke to SPEC admin | Implementer rejects X-19 | Fixed: Out of scope rewritten |
| 5 | X-19, X-20, R-29 | 2 | No guard on Deleted, Banned, Suspended members | Revoke after ban | Fixed from SRC-26 U4: R-29, R-30, R-31 refuse Deleted, Banned, Suspended members; AC-125, AC-127 |
| 6 | R-30 | 6 / 2 | Revocation with no resubmissions left | Man revoked at resubmissions = 3 keeps paying | Fixed from SRC-26 U5: R-30 no automatic grant; AC-126 |
| 7 | R-29, R-30, R-31 refusals | 6 | Refusal ACs missing; X-19, X-20 guards empty | Revoke with reason "   " | Fixed: X-19 guard R-30, X-20 guard R-31; AC-122, AC-124, AC-125, AC-127 |
| 8 | R-29 | 2 | Two grants at the same moment | Limit becomes 5 | Fixed from SRC-26 U6: R-29 first write wins; AC-123 |
| 9 | DF-20 | 3 / 4 | Flag closing only defined for override | Close a 14-day flag | Fixed from SRC-26 U7: DF-20 closes only on override here; general flag handling in SPEC admin phần 2 |
| 10 | R-23, DF-11 | 1 | History entries for grants and revocations lack source and AC | Grant not in history | Fixed from SRC-26 U8: R-23 grant and revocation history (admin, reason, time); AC-128 |

Process note: SRC-24 and SRC-25 are approved together with SPEC-8 and the revisions (`--with-sources`).

Resolution: every finding changed the revision or was confirmed by the owner (SRC-26, answered "theo đề xuất"). The changes were checked against SRC-26 by the drafting agent, not by a fresh reviewer.
