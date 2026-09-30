---
review_of: SPEC-3
version: 0.1.0
reviewed_hash: sha256:a080ab4bcfb97557ae136ebf
---

# Review SPEC-3 0.1.0

- Reviewer: fresh-context subagent (general-purpose), no conversation history
- Date: 2026-09-29
- Files read: specs/spec/SPEC-3-ho-so-va-kham-pha.md, specs/brief/BRIEF-1-filipinaconnect-us-mvp.md, SRC-1, SRC-3, SRC-5, SRC-10, SRC-12, SRC-13, reference/spec-logic.md
- No layer leak found.

## Findings

| # | Item | Category | Finding | Falsifying situation | Resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | R-07, R-04, R-09 vs BRIEF-1/C-09 | 3 / 1 | A Freemium man can never receive a like; "không like lại được" is unsourced | Maria cannot like back john, who never paid | Fixed from SRC-14 G1: R-05, R-07; AC-18, AC-53 |
| 2 | R-12, R-03, R-13 | 1 / 4 | Journey order turned into hard gates; SRC-12#L27 ties education only to contact requests | Maria without education refused the Lobby | Confirmed from SRC-14 G2: gates kept (R-03, R-12, R-13) |
| 3 | R-01, DF-06 | 4 / 5 | "xem" in source vs "hiện" in SPEC; profiles opened from "Đã thích bạn" | John scrolls past 20 cards without opening any | Fixed from SRC-14 G3: T-11, R-01; AC-54 |
| 4 | R-01 | 2 | Package starting or ending mid-day; two devices at 19 views | Package ends at 15:00 after 50 views | Fixed from SRC-14 G4: R-01; AC-55, AC-56 |
| 5 | R-04 | 2 | Revoked, suspended, banned or deleted members not hidden; women without education visible | Suspended maria still in john's search | Fixed from SRC-14 G5: T-10, R-04; AC-57 |
| 6 | R-10 | 2 / 5 | Editing away a required field after completion | Maria sets bio to "   " | Fixed from SRC-14 G6: R-10; AC-58 |
| 7 | Scope / C-16 | 1 | "chế độ hiển thị" of C-16 has no rule | Member wants to hide her profile | Fixed from SRC-14 G7: R-19, DF-11, P-10; AC-59, AC-60 |
| 8 | AC-22 | 6 | Given lacks goal; Then does not prove completeness at the upper limits | Code rejects exactly 1000 characters | Fixed: AC-22 has a goal and expects "Hồ sơ hoàn chỉnh" |
| 9 | R-08, DF-01 | 5 | Unit of "1000 ký tự" | Bio typed in NFD | Fixed from SRC-14 G8: DF-01; AC-61 |
| 10 | R-14 age | 5 / 4 | Age computation and time zone; one-sided range; "≥ 18" | Anna's birthday on the UTC/Manila edge | Fixed from SRC-14 G9: R-14, DF-10; AC-37 |
| 11 | R-14 sort | 1 / 6 | Order among unscored profiles; equal completedAt | Mia and zoe both unscored | Fixed from SRC-14 G10: R-14; AC-62 |
| 12 | T-08 | 4 | Integer, symmetric score unsourced | SmartMatchApp returns 87.5, or 87/72 per direction | Fixed from SRC-14 G11: T-08, R-15; AC-63 |
| 13 | R-13, T-05 | 5 | "Duyệt" vs Lobby undefined | Paid man without profile browses the Lobby | Fixed from SRC-14 G12: T-05, R-02, R-13, P-07 |
| 14 | P-02, P-04 vs R-03 | 5 | Woman refused the Lobby may still open and like from "Đã thích bạn" | Maria without education likes peter back | Fixed from SRC-14 G13: R-03, P-02; AC-64 |
| 15 | R-11 | 2 | Zero published lessons; lessons changing mid-way | Launch day with no lessons | Fixed from SRC-14 G14: R-11; AC-65, AC-66 |
| 16 | Lapsed package | 2 | Man with complete profile returns to Freemium | John's package expires | Fixed from SRC-14 G15: R-20; AC-55, AC-67 |
| 17 | R-17, AC-44 | 6 / 5 | Photo count in AC-44; number of records; old and new values | Completing with 2 photos | Fixed from SRC-14 G16: R-17; AC-44 |
| 18 | P-09 | 4 | Anyone can do cultural education at any time | Freemium man finishes it on day 1 | Fixed from SRC-14 G17: R-11, P-09; AC-68 |

Process note: SRC-12 and SRC-13 are draft; they are approved together with SPEC-3 (`--with-sources`).

## Top three

1. A Freemium man can never receive a like (#1).
2. Journey order used as gates beyond SRC-12#L27 (#2).
3. Unit of the 20-profile daily limit (#3, #4).

Resolution: all 18 findings changed the SPEC or were confirmed by the owner (SRC-14, answered "theo luôn đề xuất"). The changes were checked against SRC-14 by the drafting agent, not by a fresh reviewer.
