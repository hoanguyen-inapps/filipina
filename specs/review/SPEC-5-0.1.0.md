---
review_of: SPEC-5
version: 0.1.0
reviewed_hash: sha256:74f7ee5aa7dcf95be682d0cf
---

# Review SPEC-5 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-5-thanh-toan-va-goi-thanh-vien.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, SRC-1, SRC-8, SRC-10, SRC-17, reference/spec-logic.md; membership lines of SPEC-1..SPEC-4 for consistency
- T-02, R-05 and R-16 were open CLARIFY markers at review time (owner questions J1, J2, J3).

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-08 | 2 | Chargeback on a Payment of an ended or older Subscription | Chargeback arrives 40 days after the gói ended | Fixed from SRC-18 J4: R-08; AC-40, AC-41 |
| 2 | R-07 | 2 | Successful retry reported after the grace period ended | Charged 49,00 USD with gói Ended | Fixed from SRC-18 J5: R-07, DF-09; AC-24 |
| 3 | R-02, DF-01 | 2 | Two checkouts confirmed one after the other | Two tabs, two charges | Fixed from SRC-18 J6: R-02; AC-09 |
| 4 | R-06, AC-20 | 3 / 1 | "kỳ hiện tại" narrower than SRC-17#L23; AC-20 contradicts R-06 | Full refund of an older Payment | Fixed from SRC-18 J7: T-07, R-06; AC-31, AC-33 |
| 5 | R-06, R-11 | 5 | Is a full refund with or without tax | Refund 49,00 of 53,04 | Fixed from SRC-18 J8: R-06; AC-25, AC-26 |
| 6 | R-06, R-16 | 3 / 2 | Admin action vs processor confirmation; partial refunds summing to full; over-refund; two admins | Processor rejects the refund | Fixed from SRC-18 J9: R-06; AC-27, AC-28, AC-29, AC-30 |
| 7 | R-04, DF-09 | 2 | Renewal price after an admin price change | Price 49 → 59 before renewal | Fixed from SRC-18 J10: DF-06 lockedPrice, R-04; AC-12 |
| 8 | AC-07 | 3 | Expects search right after purchase, contradicting SPEC-3 R-13 | Man without complete profile | Fixed: AC-07 checks the gói and the profile-completion step |
| 9 | R-09 | 2 | Term change while Cancelling or PastDue | Change to 12 months while PastDue | Fixed from SRC-18 J11: R-09; AC-45 |
| 10 | R-07 | 4 | New period start after retry; card update during PastDue | Retry succeeds on day 2 | Fixed from SRC-18 J12: R-07; AC-21, AC-22 |
| 11 | Scope | 2 | Suspended or banned account keeps renewing | Banned man charged | Fixed from SRC-18 J13: R-17, X-14, X-15; AC-56, AC-57 |
| 12 | N-01 | 6 / 2 | No target for noticing a lost gói; 60 s not tested at the boundary | App still allows search 30 min after chargeback | Fixed from SRC-18 J14: N-01 covers start and end; AC-08, AC-58 |
| 13 | T-06, AC-15 | 1 / 2 | Boundary and "exact moment, whenever the job runs" not carried over | Job runs 3 min late | Fixed from SRC-18 J15: R-18, N-02; AC-15, AC-23 |
| 14 | R-05, R-04 | 2 | Cancel or resume at periodEnd; repeated actions | Cancel at 08:59:59 with renewal in flight | Fixed from SRC-18 J16: R-05; AC-15, AC-16 |
| 15 | R-14 | 6 / 1 | "Kết thúc gói" record not listed; several events untested | No audit on refund | Fixed from SRC-18 J17: R-14 lists the end of a gói; AC-52, AC-53 |
| 16 | P-02, P-03 | 4 | Admin = N unsourced | Support cancels on request | Confirmed from SRC-18 J18: admin cells stay N; SPEC admin |
| 17 | R-10 | 5 | Cancel, resume, change term in the app or website only | Delete account in app requires cancel first | Fixed from SRC-18 J19: R-10; AC-19 |
| 18 | ASM-02 | 3 | BRIEF-1/RISK-01 says review store policy before the payment SPEC | Apple rejects the button | Confirmed from SRC-18 J20: approve now; ASM-02 notes the change flow |

Process note: SRC-17 is draft; it is approved together with SPEC-5 (`--with-sources`).

## Top three

1. Chargeback on an ended or older Subscription (#1).
2. Money taken with no gói: late retry success, double checkout (#2, #3).
3. Full refund scope and tax (#4, #5).

Resolution: all 18 findings changed the SPEC or were confirmed by the owner (SRC-18, answered "theo đề xuất"); T-02, R-05 and R-16 were filled from SRC-18 J1–J3. One choice by the drafting agent: on a term change, lockedPrice becomes the current price of the new term (R-09). The changes were checked against SRC-18 by the drafting agent, not by a fresh reviewer.
