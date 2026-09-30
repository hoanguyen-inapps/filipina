---
review_of: SPEC-4
version: 0.1.0
reviewed_hash: sha256:127a7b50aeaa2e01817eab25
---

# Review SPEC-4 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-4-ket-noi-va-nhan-tin.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, SRC-1, SRC-10, SRC-12, SRC-15, reference/spec-logic.md
- R-18 and R-19 were open CLARIFY markers at review time (owner questions I1, I2).

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-06 | 2 / 6 | Actions at or after the 14-day mark before the expiry job runs | maria accepts at 14 days + 30 s | Fixed from SRC-16 I3: R-06, N-01, guards on X-01..X-03; AC-10, AC-11, AC-12 |
| 2 | State grid | 2 | Refused cells (accept Withdrawn/Expired, double accept, end Ended) have no rule or AC | maria accepts after john withdrew | Fixed from SRC-16 I4: R-20; AC-45, AC-46, AC-47 |
| 3 | X-01, R-15 | 2 | Man's package expires while his requests are Pending | maria accepts after john's package ended | Fixed from SRC-16 I5: R-15, X-05; AC-33 |
| 4 | P-02, P-04 | 2 / 6 | Only the recipient may decide; only members may message | anna accepts a request sent to maria | Fixed: R-09 (only the recipient), R-10 (only members); AC-19, AC-22 |
| 5 | DF-08, R-06, R-16 | 2 | Re-sending after Expired; what each side sees | john re-sends every 14 days | Fixed from SRC-16 I6: R-21, DF-08; AC-15, AC-48 |
| 6 | R-13 | 1 | "không bao giờ" after ending is not in SRC-15#L29 | maria wants to reconnect | Confirmed from SRC-16 I7: never, whoever ended; R-13 |
| 7 | R-14 | 4 / 1 | History visible after Ended; no editing; retention | maria ends because of harassment | Fixed from SRC-16 I8: R-14; AC-31 |
| 8 | R-10 | 4 / 5 | Character counting; whitespace-only; trimming | Emoji at the 2000 limit | Fixed from SRC-16 I9: R-10, DF-06; AC-24 |
| 9 | R-03, R-16 | 5 / 2 | What counts toward 15; simultaneous sends | Two phones send the 15th and 16th together | Fixed from SRC-16 I10: R-03, R-16; AC-36, AC-37, AC-38 |
| 10 | T-03 | 5 | "Nam có gói" undefined; account and verification state at send | Cancelled plan still in paid period | Fixed from SRC-16 I11: T-04, R-01 table; AC-50, AC-51 |
| 11 | R-01 table row 3, AC-03 | 6 | Row "có gói, hồ sơ chưa hoàn chỉnh" untested; missing step not checked | Code skips the profile check | Fixed: AC-49 for row 3; AC-03 checks the step shown |
| 12 | R-17 | 6 | Decline, withdraw and expire records untested; actor on expiry | No audit on decline | Fixed: AC-12, AC-13, AC-15; expiry actor "hệ thống" from SRC-16 I3 |
| 13 | T-05, R-06, R-08 | 1 / 4 | 336 h and 720 h, and the ≥ mark, extended from SPEC-1/2 | Request sent 23:00 UTC | Fixed from SRC-16 I12: R-06, R-08 in hours |
| 14 | R-13, R-10 | 2 | End vs message at the same moment; both ending | Message 100 ms after end | Fixed from SRC-16 I13: R-18; AC-41, AC-42 |
| 15 | AC-23 | 6 | Screens and values not concrete | Instagram handle in a field | Fixed: AC-26 with concrete screens and values |
| 16 | Permissions | 2 | Admin column missing | Admin ends a connection after a report | Fixed from SRC-16 I14: admin column, P-08; AC-52 |
| 17 | T-04 | 5 | 23:59:59 boundary with sub-second times | Request at 23:59:59.500 | Fixed: T-05 is [00:00:00, 24:00:00); AC-07 |

Process note: SRC-15 is draft; it is approved together with SPEC-4 (`--with-sources`).

## Top three

1. Actions after the 14-day mark before the job runs (#1).
2. Pending requests of a man whose package expired (#3).
3. Recipient and membership checks; refused cells in the state grid (#4, #2).

Resolution: all 17 findings changed the SPEC or were confirmed by the owner (SRC-16, answered "theo đề xuất"); R-18 and R-19 were filled from SRC-16 I1 and I2. Shared terms were aligned with the approved SPEC-1 and SPEC-3 (G02). The changes were checked against SRC-16 by the drafting agent, not by a fresh reviewer.
