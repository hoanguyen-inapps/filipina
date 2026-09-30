---
review_of: SPEC-7
version: 0.1.0
reviewed_hash: sha256:6e4d63e9e98b28bb9a4715d3
---

# Review SPEC-7 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Files read: specs/spec/SPEC-7-thong-bao-va-deep-link.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, SRC-1, SRC-10, SRC-22, SPEC-2, SPEC-4, SPEC-5, SPEC-6, reference/spec-logic.md
- R-03 was an open CLARIFY marker at review time (owner question O1).

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-10, AC-23 | 3 | Ended or blocked conversation cannot open from a notification, but SPEC-4/R-14 and SPEC-6/R-16 keep it readable | Old message notification after the connection Ended | Fixed from SRC-23 O2: R-09 read-only conversation; AC-26 |
| 2 | R-06 | 1 / 4 | "mỗi thành viên nhận" added to a per-conversation limit | Reply within 5 minutes | Confirmed from SRC-23 O3: per recipient; AC-19 |
| 3 | Event (7) | 5 | Not tied to a SPEC-5 transition; retries could each notify | 4 failures give 4 emails | Fixed from SRC-23 O4: T-01 (7) = entering PastDue; AC-09 |
| 4 | Event (9) | 5 / 6 | Which transitions to Ended count | Refund, chargeback, ban | Fixed from SRC-23 O5: T-01 (9) every Ended; R-01, R-02; AC-41, AC-42 |
| 5 | Events (5), (6) | 2 / 6 | Service result vs admin decision; no AC for (6), Declined, Failed | Service "đạt" before admin decides | Fixed from SRC-23 O6: T-01 (5), (6); AC-04..AC-07 |
| 6 | R-14 | 2 | Cancel with < 3 days left; resume and cancel again; suspension | Cancel 24 h before periodEnd | Fixed from SRC-23 O7: R-14; AC-37..AC-40 |
| 7 | R-09, R-01 | 2 | Suspended or banned recipients | Suspended man taps a gói push | Fixed from SRC-23 O8: R-01, R-02; AC-40, AC-42 |
| 8 | R-09, R-13 | 2 / 3 | Email links, logout, different member logged in, desktop | anna taps john's old push | Fixed from SRC-23 O9: R-09, R-13, R-15; AC-29, AC-30, AC-36, AC-43, AC-44 |
| 9 | R-08 | 5 / 6 | Active block or any block; existing items and pending sends | Like at 09:00, block at 10:00 | Fixed from SRC-23 O10: R-08; AC-22..AC-24 |
| 10 | R-09 event (4) | 4 | Target for a like is unsourced | Liker's profile vs list | Confirmed from SRC-23 O11: R-09; AC-27 |
| 11 | R-05 | 5 | Outcome in push for (5), (6); names in in-app items and emails | "Your verification was declined" | Fixed from SRC-23 O12: R-05; AC-04, AC-05, AC-08 |
| 12 | N-01 | 1 / 3 | Delivery vs hand-off; start for time-based events | Ended at 09:04 under SPEC-5/N-02 | Fixed from SRC-23 O13: N-01 |
| 13 | R-10 | 2 / 1 | Request no longer Pending; "nội dung đã bị gỡ" unsourced | Tap (1) after withdrawal | Fixed from SRC-23 O14: R-10; AC-32, AC-33 |
| 14 | AC-07 | 6 | R-11 not really proven | Email sent when OS permission denied | Fixed: AC-10 uses event (1) with OS permission denied |
| 15 | T-02, R-13 | 1 | Website sessions excluded | Desktop browser session | Fixed from SRC-23 O15: T-02, R-13; AC-35 |
| 16 | R-04 | 5 | Switches per account or per device | Phone off, tablet on | Fixed from SRC-23 O16: R-04, DF-02; AC-13 |
| 17 | R-01, R-06 | 5 | Recipient viewing the conversation | Message while reading | Fixed from SRC-23 O17: R-01, R-03, R-06; AC-20 |
| 18 | R-03, AC-08 | 5 | Exact-second deletion with no allowance | Cleanup at 10:03 | Fixed from SRC-23 O18: R-03; AC-12 |
| 19 | R-12, AC-24 | 1 / 6 | Reinterpretation of quoted text; no exact strings | Any English text passes | Confirmed from SRC-23 O19: R-12, ASM-01; AC-34 tests meaning |

Process note: SRC-22 is draft; it is approved together with SPEC-7 (`--with-sources`).

## Top three

1. Notification target vs readable history in SPEC-4 and SPEC-6 (#1).
2. Push window per conversation or per recipient (#2).
3. Events (7) and (9) not tied to SPEC-5 transitions (#3, #4).

Resolution: all 19 findings changed the SPEC or were confirmed by the owner (SRC-23, answered "theo đề xuất"); R-03 was filled from SRC-23 O1. The changes were checked against SRC-23 by the drafting agent, not by a fresh reviewer.
