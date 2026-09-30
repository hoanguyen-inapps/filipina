---
review_of: SPEC-8
version: 0.1.0
reviewed_hash: sha256:448db3d08ac7b98e2789c250
---

# Review SPEC-8 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Files read: SPEC-8, BRIEF-1, SRC-1, SRC-10, SRC-20, SRC-24, SPEC-1, SPEC-2, SPEC-6 (full); SPEC-3, SPEC-4, SPEC-5, SPEC-7 (cited rows); SRC-8#L50-L70; reference/spec-logic.md
- R-03, R-05 and R-09 were open CLARIFY markers at review time (owner questions T1, T2, T3).

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | X-05, X-06, R-09, R-10 | 2 | appeal_accepted not tied to the appealed decision | Old suspension appeal accepted after a ban | Fixed from SRC-25 T4: T-06, R-07, R-08, R-10 (appeal tied to its decision); AC-27, AC-38 |
| 2 | R-14 | 2 | Revocation leaves requests, connections, subscription, notification undefined | Revoked for fake ID, keeps messaging | Fixed from SRC-25 T5: R-14; SPEC-4 revision R-19; AC-50, AC-51 |
| 3 | R-01 | 3 | "Cấp cao nhất có mọi quyền" vs SPEC-2 T-09/R-14 (only Xác minh sees confidential records) | top1 opens a CENOMAR | Fixed from SRC-25 T6: R-01, R-13 (Cấp cao nhất needs Xác minh too); AC-04, AC-48 |
| 4 | R-02, P-01 | 2 | Disabling admins, role changes, last top admin, 2FA enrolment and recovery | Admin leaves; lost phone | Fixed from SRC-25 T7: R-17, AdminAccount machine; AC-11, AC-12, AC-56..AC-59, AC-61 |
| 5 | R-12 | 1 | Grants allowed in any state | Grant at resubmissions = 1 | Fixed from SRC-25 T8: R-12; AC-45 |
| 6 | ASM-01 | 3 | SPEC-2 revision must replace every hard-coded 3, make Approved and Failed non-terminal, add ReviewFlag states | "liên hệ hỗ trợ" after a grant | Fixed: SPEC-2 revision DF-10, DF-19, X-06, R-03, R-04, R-05, S-04, S-12, DF-20 |
| 7 | R-06, R-07 | 2 | Pending verification of a suspended or banned member (handed over by SPEC-2) | AwaitingAdmin while suspended | Fixed from SRC-25 T9: R-06, R-07, R-11; SPEC-2 revision X-21..X-26; AC-21, AC-27 |
| 8 | R-08 | 4 | Who may lift a suspension; self-lift bypasses four eyes | Suspend and lift alone in 5 minutes | Fixed from SRC-25 T10: R-08; AC-31 |
| 9 | Standing machine | 2 | Repeated actions, concurrency, account status | Two suspends 50 ms apart | Fixed from SRC-25 T11: R-18, guards on X-01..X-04; AC-23, AC-24, AC-25, AC-32 |
| 10 | R-10 | 1 | "like cũ không được khôi phục" unsourced; Cancelling plan after reinstatement | Likes after reinstatement | Fixed from SRC-25 T12: R-06, R-08, R-10; AC-21, AC-30 |
| 11 | R-15 | 5 | Date filter time zone, inclusiveness, precision | Record at the day edge | Fixed from SRC-25 T13: R-15; AC-53 |
| 12 | R-03, AC-08 | 5 / 6 | 2FA failures counting; window; 30:00 boundary | Missing code then wrong passwords | Fixed from SRC-25 T14: R-03; AC-09, AC-10, AC-13 |
| 13 | R-05 | 5 / 6 | Written-request reference, blank reason, which accounts, audit actor | Reason "   ", reference "x" | Fixed from SRC-25 T15: R-05; SPEC-1 revision R-19; AC-16..AC-19 |
| 14 | P-09, R-09 | 2 | Rejecting an appeal: reason, four eyes | Self-reject with empty reason | Fixed from SRC-25 T16: R-09, R-10; AC-35 |
| 15 | R-11 | 5 | Queue ordering key, ties, listed states | Resubmission vs first submission | Fixed from SRC-25 T17: R-11; AC-39..AC-41 |
| 16 | R-13 | 6 / 2 | Downstream effects and notification; Passed → Failed | Buy after override | Fixed from SRC-25 T18: R-13; AC-47, AC-49 |
| 17 | AC-15, AC-11, F-01 1a | 6 | ACs without concrete effects; no Xác minh-only refusal | Suspension leaves request Pending | Fixed: AC-21, AC-16 concrete; AC-03 refusal for Xác minh-only admin |
| 18 | R-16 | 1 | Logging refused actions, failed logins, idle logouts | Unknown-email login attempt | Fixed from SRC-25 T19: R-16; AC-13, AC-54 |
| 19 | R-04 | 5 | Search semantics; Deleted and Expired accounts | "santos", "maria@" | Fixed from SRC-25 T20: R-04; AC-14 |

Process note: SRC-24 is draft; it is approved together with SPEC-8 (`--with-sources`).

## Top three

1. Appeal not tied to its decision (#1).
2. Effects of revoking verification (#2).
3. Top admin vs Xác minh role on confidential records (#3); admin lifecycle (#4).

Resolution: all 19 findings changed SPEC-8 or the SPEC-1, SPEC-2, SPEC-4 and SPEC-5 revisions (SRC-25, answered "theo đề xuất"); R-03, R-05 and R-09 were filled from SRC-25 T1–T3. One reading by the drafting agent: R-13 requires both Cấp cao nhất and Xác minh, combining SRC-24#L28 with SRC-25#L24. The changes were checked against SRC-25 by the drafting agent, not by a fresh reviewer.

## Re-stamps

| Date | From | To | Note |
| --- | --- | --- | --- |
| 2026-09-30 | sha256:cf73628684e86409d8cf1ab5 | sha256:448db3d08ac7b98e2789c250 | SRC-26 U1–U4, U6, U9–U11: R-05, R-07, R-10, R-12, R-13, R-14 aligned with the SPEC-1, SPEC-2, SPEC-5 revisions; checked against SRC-26 by the drafting agent, not by a fresh reviewer |
