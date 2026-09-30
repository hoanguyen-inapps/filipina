---
review_of: SPEC-9
version: 0.1.0
reviewed_hash: sha256:15e985ed76b83d6d9d14305f
---

# Review SPEC-9 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-30
- Scope: the whole draft
- Files read: SPEC-9, the SPEC-3, SPEC-5, SPEC-6 and SPEC-7 revisions and their approved versions (diffed), SPEC-1, SPEC-2, SPEC-4, SPEC-8, BRIEF-1 C-30..C-40, SRC-27 in full, cited lines of SRC-1, SRC-3, SRC-12, SRC-15..SRC-20, SRC-24, reference/spec-logic.md
- The two CLARIFY markers in the SPEC-7 revision were known open questions and are not findings.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-14 | 3 / 4 | All admins see the flag queue with reports, messages and payments denied elsewhere | Xác minh-only admin5 sees report content and a Payment | Fixed from SRC-28 W5: R-14 each admin sees only the flag types they can close; AC-41 |
| 2 | R-14 | 5 | Tie-break by flag code across three code spaces; flags of suspended members | Two flags #7 at 09:00:00 | Fixed from SRC-28 W6: R-14 tie-break by type then code; suspended members shown; AC-41 |
| 3 | T-03, R-09 | 4 | Related conversations for a suspicious flag = all conversations (inference) | admin1 opens john–lisa under flag (a) | Fixed from SRC-28 W7: T-03 per signal; AC-25, AC-73 |
| 4 | R-09, DF-08 | 5 / 4 | Reason rule for an admin with Hỗ trợ and Cấp cao nhất; CSV columns unsourced | Both roles, no reason, related conversation | Fixed from SRC-28 W8: R-09, DF-08 reason rules and CSV columns; AC-26, AC-74 |
| 5 | R-10 | 4 | Only Active blocks shown; removed blocks still bar requests (SPEC-4/R-22) | Unblocked maria not visible to support | Fixed from SRC-28 W9: R-10 shows Removed blocks with unblock time; AC-29 |
| 6 | R-06, R-15 | 2 | Concurrent flag handling; reactivation vs own purchase; late Payment already refunded | Two live Subscriptions | Fixed from SRC-28 W10: R-06 first write wins, purchase race, refunded or chargebacked Payment; SPEC-5 R-20; AC-70..AC-72 |
| 7 | R-04 | 2 / 5 | Remainder ignores chargebacks; no precision for refund amounts | Refund 49,00 after chargeback of 49,00 | Fixed from SRC-28 W11: R-04 no refund after chargeback, 2 decimals; SPEC-5 R-06; AC-67 |
| 8 | R-03, AC-05 | 2 / 6 | Which moment of a purchase decides the price; no AC for term change | Checkout 09:59, price change 10:00, confirm 10:00:30 | Fixed from SRC-28 W13: R-03 price at checkout click; SPEC-5 R-03, R-09; AC-05, AC-66 |
| 9 | R-17, DF-04, X-01..X-03 | 5 / 6 | Body limits, image rules, position, Draft deletion; refused state cells untested | Publish an empty body | Fixed from SRC-28 W14: DF-04, R-17, S-04 Deleted, X-04; AC-49, AC-78, AC-79 |
| 10 | R-20, R-21, AC-61 | 6 / 2 | No boundary-accepted AC; double send; empty group; English not checkable | Double click sends two copies | Fixed from SRC-28 W15: R-20 confirmation and empty group, R-21 send once, language not checked; AC-59, AC-82..AC-84 |
| 11 | R-19, T-04 | 5 | "Cảnh báo lừa đảo" is inline text, not a screen; no length limits | Edit of the warning under messages | Fixed from SRC-28 W16: T-04, DF-06, R-19; AC-81 |
| 12 | R-13 | 2 | No undo; original not kept; race with member delete | Wrong photo removed | Fixed from SRC-28 W17: R-13, DF-03 no undo, original kept for admins, first write wins; AC-75, AC-76 |

Process note: SRC-27 is draft; it is approved together with SPEC-9 and the revisions (`--with-sources`).

Resolution: every finding changed the artifact or was confirmed by the owner (SRC-28, answered "theo đề xuất"). The changes were checked against SRC-28 by the drafting agent, not by a fresh reviewer.
